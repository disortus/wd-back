import Order from "../../models/Order.js";
import User from "../../models/User.js";
import Product from "../../models/Product.js";
import { ORDER_STATUS_TYPES, USER_ROLE_TYPES } from "../../utils/enums.js";
import { AppError } from "../../utils/app-errors.js";
import { asyncHandler } from "../../utils/async-handler.js";

// Get all orders for moderation
export const getOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    
    // Filter by status
    if (status) {
        query.status = status;
    } else {
        // By default, show orders that need moderation
        query.status = {
            $in: [
                ORDER_STATUS_TYPES.CREATED,
                ORDER_STATUS_TYPES.ACCEPTED_BY_MODERATOR,
                ORDER_STATUS_TYPES.PACKED
            ]
        };
    }

    const orders = await Order.find(query)
        .populate("userId", "fullname phone")
        .populate("moderator", "fullname phone")
        .populate("courier", "fullname phone")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
        ok: true,
        data: orders,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

// Get single order
export const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("userId", "fullname phone")
        .populate("moderator", "fullname phone")
        .populate("courier", "fullname phone");

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    res.json({
        success: true,
        data: order
    });
});

// Accept order (moderator takes it)
export const acceptOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    // Check if already accepted by another moderator
    if (order.moderator && order.moderator.toString() !== req.auth.id) {
        throw new AppError(400, "Order already accepted by another moderator");
    }

    if (order.status !== ORDER_STATUS_TYPES.CREATED) {
        throw new AppError(400, "Order is not in created status");
    }

    order.moderator = req.auth.id;

    order.status = ORDER_STATUS_TYPES.ACCEPTED_BY_MODERATOR;

    order.statusHistory.push({
        status: ORDER_STATUS_TYPES.ACCEPTED_BY_MODERATOR,
        changedAt: new Date(),
        changedBy: req.auth.id,
        note: "Accepted by moderator"
    });

    await order.save();

    res.json({
        ok: true,
        data: order
    });
});

// Pack order
export const packOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    if (order.status !== ORDER_STATUS_TYPES.ACCEPTED_BY_MODERATOR) {
        throw new AppError(400, "Order must be accepted before packing");
    }

    if (order.moderator?.toString() !== req.auth.id) {
        throw new AppError(403, "You are not assigned to this order");
    }

    order.status = ORDER_STATUS_TYPES.PACKED;

    order.statusHistory.push({
        status: ORDER_STATUS_TYPES.PACKED,
        changedAt: new Date(),
        changedBy: req.auth.id,
        note: "Order packed"
    });

    await order.save();

    res.json({
        ok: true,
        data: order
    });
});

// Get available couriers
export const getAvailableCouriers = asyncHandler(async (req, res) => {
    const couriers = await User.getAvailableStaff([USER_ROLE_TYPES.COURIER]);

    res.json({
        ok: true,
        data: couriers
    });
});

// Assign order to courier
export const assignToCourier = asyncHandler(async (req, res) => {
    const { courierId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    if (order.status !== ORDER_STATUS_TYPES.PACKED) {
        throw new AppError(400, "Order must be packed before assigning to courier");
    }

    if (order.moderator?.toString() !== req.auth.id) {
        throw new AppError(403, "You are not assigned to this order");
    }

    const courier = await User.findOne({
        _id: courierId,
        role: USER_ROLE_TYPES.COURIER,
        isActive: true
    });

    if (!courier) {
        throw new AppError(404, "Courier not found");
    }

    order.courier = courierId;

    order.status = ORDER_STATUS_TYPES.ASSIGNED_TO_COURIER;

    order.statusHistory.push({
        status: ORDER_STATUS_TYPES.ASSIGNED_TO_COURIER,
        changedAt: new Date(),
        changedBy: req.auth.id,
        note: `Assigned to courier: ${courier.fullname}`
    });

    await order.save();

    res.json({
        ok: true,
        data: order
    });
});

// Cancel order (moderator cancels)
export const cancelOrder = asyncHandler(async (req, res) => {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    // Can't cancel if already delivered or canceled
    if (order.status === ORDER_STATUS_TYPES.DELIVERED || order.status === ORDER_STATUS_TYPES.CANCELED || order.status === ORDER_STATUS_TYPES.IN_DELIVERY) {
        throw new AppError(400, "Cannot cancel this order");
    }

    // Restore product stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    // Update user stats
    const user = await User.findById(order.userId);

    await user.updateOrderStats(order.totalPrice, false);

    order.status = ORDER_STATUS_TYPES.CANCELED;

    order.canceledAt = new Date();

    order.cancelReason = reason || "Canceled by moderator";

    order.statusHistory.push({
        status: ORDER_STATUS_TYPES.CANCELED,
        changedAt: new Date(),
        changedBy: req.auth.id,
        note: reason || "Canceled by moderator"
    });

    await order.save();

    res.json({
        ok: true,
        data: order
    });
});

// Get order statistics
export const getOrderStats = asyncHandler(async (req, res) => {
    const totalOrders = await Order.countDocuments();

    const ordersByStatus = await Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const totalRevenue = await Order.aggregate([
        { $match: { status: { $ne: ORDER_STATUS_TYPES.CANCELED } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
        ok: true,
        data: {
            totalOrders,
            ordersByStatus: Object.fromEntries(ordersByStatus.map(s => [s._id, s.count])),
            totalRevenue: totalRevenue[0]?.total || 0,
            recentOrders
        }
    });
});
