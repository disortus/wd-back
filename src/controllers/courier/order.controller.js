import Order from "../../models/Order.js";
import User from "../../models/User.js";
import { ORDER_STATUS_TYPES } from "../../utils/enums.js";
import { AppError } from "../../utils/app-errors.js";
import { asyncHandler } from "../../utils/async-handler.js";

// Get available orders for delivery
export const getAvailableOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    const orders = await Order.find({
        status: ORDER_STATUS_TYPES.ASSIGNED_TO_COURIER,
        courier: null })
        .populate("userId", "fullname phone")
        .sort({ createdAt: 1 }) // Oldest first (FIFO)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Order.countDocuments({
        status: ORDER_STATUS_TYPES.ASSIGNED_TO_COURIER,
        courier: null
    });

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

// Get my assigned orders
export const getMyOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;

    const query = { courier: req.auth.id };

    if (status) {
        query.status = status;
    }

    const orders = await Order.find(query)
        .populate("userId", "fullname phone")
        .populate("moderator", "fullname phone")
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
        .populate("moderator", "fullname phone");

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    res.json({
        ok: true,
        data: order
    });
});

// Accept delivery order
export const acceptOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    if (order.status !== ORDER_STATUS_TYPES.ASSIGNED_TO_COURIER) {
        throw new AppError(400, "Order is not available for acceptance");
    }

    if (order.courier && order.courier.toString() !== req.auth.id) {
        throw new AppError(400, "Order already accepted by another courier");
    }

    order.courier = req.auth.id;
    order.statusHistory.push({
        status: order.status,
        changedAt: new Date(),
        changedBy: req.auth.id,
        note: `Accepted by courier: ${req.user.fullname}`
    });

    await order.save();

    res.json({
        ok: true,
        data: order
    });
});

// Start delivery (mark as in delivery)
export const startDelivery = asyncHandler(async (req, res) => {
    const { deliveryNote } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    if (order.courier?.toString() !== req.auth.id) {
        throw new AppError(403, "You are not assigned to this order");
    }

    if (order.status !== ORDER_STATUS_TYPES.ASSIGNED_TO_COURIER && 
        order.status !== ORDER_STATUS_TYPES.IN_DELIVERY) {
        throw new AppError(400, "Cannot start delivery for this order");
    }

    order.status = ORDER_STATUS_TYPES.IN_DELIVERY;
    if (deliveryNote) {
        order.deliveryNote = deliveryNote;
    }

    order.statusHistory.push({
        status: ORDER_STATUS_TYPES.IN_DELIVERY,
        changedAt: new Date(),
        changedBy: req.auth.id,
        note: "Delivery started"
    });

    await order.save();

    res.json({
        ok: true,
        data: order
    });
});

// Mark as delivered
export const markDelivered = asyncHandler(async (req, res) => {
    const { deliveryNote } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    if (order.courier?.toString() !== req.auth.id) {
        throw new AppError(403, "You are not assigned to this order");
    }

    if (order.status !== ORDER_STATUS_TYPES.IN_DELIVERY) {
        throw new AppError(400, "Order must be in delivery status");
    }

    order.status = ORDER_STATUS_TYPES.DELIVERED;

    order.deliveredAt = new Date();

    if (deliveryNote) {
        order.deliveryNote = deliveryNote;
    }

    order.statusHistory.push({
        status: ORDER_STATUS_TYPES.DELIVERED,
        changedAt: new Date(),
        changedBy: req.auth.id,
        note: "Order delivered successfully"
    });

    await order.save();

    res.json({
        ok: true,
        data: order
    });
});

// Update delivery status
export const updateDeliveryStatus = asyncHandler(async (req, res) => {
    const { status, deliveryNote } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    if (order.courier?.toString() !== req.auth.id) {
        throw new AppError(403, "You are not assigned to this order");
    }

    const validStatuses = [
        ORDER_STATUS_TYPES.ASSIGNED_TO_COURIER,
        ORDER_STATUS_TYPES.IN_DELIVERY,
        ORDER_STATUS_TYPES.DELIVERED
    ];

    if (!validStatuses.includes(status)) {
        throw new AppError(400, "Invalid status for delivery update");
    }

    order.status = status;

    if (deliveryNote) {
        order.deliveryNote = deliveryNote;
    }

    if (status === ORDER_STATUS_TYPES.DELIVERED) {
        order.deliveredAt = new Date();

        order.statusHistory.push({
            status: ORDER_STATUS_TYPES.DELIVERED,
            changedAt: new Date(),
            changedBy: req.auth.id,
            note: "Order delivered successfully"
        });
    }

    await order.save();

    res.json({
        ok: true,
        data: order
    });
});

// Get delivery statistics
export const getDeliveryStats = asyncHandler(async (req, res) => {
    const totalDelivered = await Order.countDocuments({
        courier: req.auth.id,
        status: ORDER_STATUS_TYPES.DELIVERED
    });
    
    const inDelivery = await Order.countDocuments({
        courier: req.auth.id,
        status: ORDER_STATUS_TYPES.IN_DELIVERY
    });

    const pending = await Order.countDocuments({
        courier: req.auth.id,
        status: ORDER_STATUS_TYPES.ASSIGNED_TO_COURIER
    });

    const totalEarnings = await Order.aggregate([
        { 
            $match: { 
                courier: req.auth.id,
                status: ORDER_STATUS_TYPES.DELIVERED
            }
        },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.json({
        ok: true,
        data: {
            totalDelivered,
            inDelivery,
            pending,
            totalEarnings: totalEarnings[0]?.total || 0
        }
    });
});
