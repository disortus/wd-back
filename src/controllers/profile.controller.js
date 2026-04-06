import User from "../models/User.js";
import Order from "../models/Order.js";
import SupportTicket from "../models/SupportTicket.js";
import { AppError } from "../utils/app-errors.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.auth.id);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    res.json({
        ok: true,
        data: user.getFullProfile()
    });
});

export const updateMe = asyncHandler(async (req, res) => {
    const allowedFields = [
        "fullname",
        "phone",
        "email",
        "profile",
        "addresses",
        "notifications"
    ];

    const updates = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            if (field === "profile") {
                updates.profile = { ...req.user.profile, ...req.body.profile };
            } else {
                updates[field] = req.body[field];
            }
        }
    }

    const user = await User.findByIdAndUpdate(
        req.auth.id,
        updates,
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new AppError(404, "User not found");
    }

    res.json({
        ok: true,
        data: user.getFullProfile()
    });
});

// Update email only
export const updateEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new AppError(400, "Email is required");
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: req.auth.id }
    });

    if (existingUser) {
        throw new AppError(400, "Email already in use");
    }

    const user = await User.findByIdAndUpdate(
        req.auth.id,
        { email: email.toLowerCase() },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new AppError(404, "User not found");
    }

    res.json({
        ok: true,
        data: user.getFullProfile()
    });
});

// Get order history
export const getOrderHistory = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ userId: req.auth.id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Order.countDocuments({ userId: req.auth.id });

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

// Get active orders
export const getActiveOrders = asyncHandler(async (req, res) => {
    const activeStatuses = [
        "created",
        "accepted_by_moderator",
        "packed",
        "assigned_to_courier",
        "in_delivery"
    ];

    const orders = await Order.find({
        userId: req.auth.id,
        status: { $in: activeStatuses }
    }).sort({ createdAt: -1 });

    res.json({
        ok: true,
        data: orders
    });
});

// Get order tracking details
export const getOrderTracking = asyncHandler(async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.orderId,
        userId: req.auth.id
    }).populate("moderator", "fullname email")
      .populate("courier", "fullname email phone");

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    res.json({
        ok: true,
        data: {
            orderNumber: order.orderNumber,
            status: order.status,
            statusHistory: order.statusHistory,
            items: order.items,
            totalPrice: order.totalPrice,
            deliveryAddress: order.deliveryAddress,
            recipientName: order.recipientName,
            recipientPhone: order.recipientPhone,
            moderator: order.moderator,
            courier: order.courier,
            deliveryNote: order.deliveryNote,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }
    });
});

// Get support tickets
export const getMyTickets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const tickets = await SupportTicket.find({ user: req.auth.id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await SupportTicket.countDocuments({ user: req.auth.id });

    res.json({
        ok: true,
        data: tickets,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

// Add new address
export const addAddress = asyncHandler(async (req, res) => {
    const { label, recipientName, phone, street, city, postalCode, country, instructions, isDefault } = req.body;

    const user = await User.findById(req.auth.id);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({
        label: label || "Home",
        isDefault: isDefault || false,
        recipientName,
        phone,
        street,
        city,
        postalCode,
        country,
        instructions
    });

    await user.save();

    res.json({
        ok: true,
        data: user.addresses
    });
});

// Update address
export const updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const updates = req.body;

    const user = await User.findById(req.auth.id);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const addressIndex = user.addresses.findIndex(
        addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
        throw new AppError(404, "Address not found");
    }

    // If setting as default, unset others
    if (updates.isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses[addressIndex] = {
        ...user.addresses[addressIndex].toObject(),
        ...updates
    };

    await user.save();

    res.json({
        ok: true,
        data: user.addresses
    });
});

// Delete address
export const deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;

    const user = await User.findById(req.auth.id);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    user.addresses = user.addresses.filter(
        addr => addr._id.toString() !== addressId
    );

    await user.save();

    res.json({
        ok: true,
        data: user.addresses
    });
});

// Get user statistics
export const getUserStats = asyncHandler(async (req, res) => {
    const user = await User.findById(req.auth.id);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const totalOrders = await Order.countDocuments({ userId: req.auth.id });

    const activeOrders = await Order.countDocuments({
        userId: req.auth.id,
        status: { $nin: ["delivered", "canceled"] }
    });

    const totalTickets = await SupportTicket.countDocuments({ user: req.auth.id });

    const openTickets = await SupportTicket.countDocuments({
        user: req.auth.id,
        status: { $in: ["open", "assigned"] }
    });

    res.json({
        ok: true,
        data: {
            totalOrders,
            activeOrders,
            totalSpent: user.stats?.totalSpent || 0,
            totalTickets,
            openTickets
        }
    });
});
