import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import User from "../../models/User.js";
import Product from "../../models/Product.js";
import { ORDER_STATUS_TYPES } from "../../utils/enums.js";
import { AppError } from "../../utils/app-errors.js";
import { asyncHandler } from "../../utils/async-handler.js";

// Create order from cart
export const createOrder = asyncHandler(async (req, res) => {
    const { deliveryAddress, recipientName, recipientPhone } = req.body;

    if (!deliveryAddress || !recipientName || !recipientPhone) {
        throw new AppError(400, "Delivery address, recipient name, and phone are required");
    }

    const cart = await Cart.getOrCreateCart(req.auth.id);

    if (cart.items.length === 0) {
        throw new AppError(400, "Cart is empty");
    }

    // Verify all products and stock
    for (const item of cart.items) {
        const product = await Product.findById(item.product);

        if (!product || !product.isActive) {
            throw new AppError(400, `Product "${item.productSnapshot.title}" is no longer available`);
        }

        if (product.stock < item.quantity) {
            throw new AppError(400, `Insufficient stock for "${item.productSnapshot.title}"`);
        }
    }

    const user = await User.findById(req.auth.id);

    // Calculate total
    const totalPrice = cart.items.reduce((sum, item) => {
        return sum + (item.priceSnapshot * item.quantity);
    }, 0);

    // Create order items with current snapshots
    const orderItems = cart.items.map(item => ({
        product: item.product,
        productSnapshot: item.productSnapshot,
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot,
        attributesSnapshot: item.attributesSnapshot,
        subtotal: item.priceSnapshot * item.quantity
    }));

    // Create the order
    const order = await Order.create({
        userId: user._id,
        userSnapshot: {
            fullname: user.fullname,
            phone: user.phone
        },
        items: orderItems,
        totalPrice,
        deliveryAddress: {
            address: deliveryAddress.address || deliveryAddress.street || deliveryAddress,
            entrance: deliveryAddress.entrance || "",
            apartment: deliveryAddress.apartment || "",
            city: deliveryAddress.city || "Astana",
            instructions: deliveryAddress.instructions || ""
        },
        recipientName,
        recipientPhone,
        status: ORDER_STATUS_TYPES.CREATED,
        statusHistory: [{
            status: ORDER_STATUS_TYPES.CREATED,
            changedAt: new Date(),
            changedBy: user._id,
            note: "Order created"
        }]
    });

    // Update user stats
    await user.updateOrderStats(totalPrice, true);

    // Clear the cart
    cart.clearCart();
    await cart.save();

    // Update product stock
    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }
        });
    }

    res.status(201).json({
        ok: true,
        data: order
    });
});

// Get user's orders
export const getMyOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId: req.auth.id };
    if (status) {
        query.status = status;
    }

    const orders = await Order.find(query)
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
export const getMyOrder = asyncHandler(async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.id,
        userId: req.auth.id
    }).populate("moderator", "fullname phone")
      .populate("courier", "fullname phone");

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    res.json({
        ok: true,
        data: order
    });
});

// Cancel order (only if not yet delivered)
export const cancelOrder = asyncHandler(async (req, res) => {
    const { reason } = req.body;

    const order = await Order.findOne({
        _id: req.params.id,
        userId: req.auth.id
    });

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    // Can't cancel if already delivered or canceled
    if (order.status === ORDER_STATUS_TYPES.DELIVERED) {
        throw new AppError(400, "Cannot cancel delivered order");
    }

    if (order.status === ORDER_STATUS_TYPES.CANCELED) {
        throw new AppError(400, "Order is already canceled");
    }

    // Can't cancel if already in delivery
    if (order.status === ORDER_STATUS_TYPES.IN_DELIVERY) {
        throw new AppError(400, "Cannot cancel order that is already in delivery");
    }

    // Restore product stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity }
        });
    }

    // Update user stats
    const user = await User.findById(req.auth.id);
    await user.updateOrderStats(order.totalPrice, false);

    order.status = ORDER_STATUS_TYPES.CANCELED;
    order.canceledAt = new Date();
    order.cancelReason = reason || "Canceled by user";
    order.statusHistory.push({
        status: ORDER_STATUS_TYPES.CANCELED,
        changedAt: new Date(),
        changedBy: user._id,
        note: reason || "Canceled by user"
    });

    await order.save();

    res.json({
        ok: true,
        data: order
    });
});

// Create support ticket from order
export const createOrderTicket = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { subject, description, category = "order" } = req.body;

    const order = await Order.findOne({
        _id: orderId,
        userId: req.auth.id
    });

    if (!order) {
        throw new AppError(404, "Order not found");
    }

    // This would create a ticket - import is at top if SupportTicket model exists
    // For now, return a placeholder response
    res.status(201).json({
        ok: true,
        message: "Support ticket creation - import SupportTicket in routes",
        data: {
            orderId: order._id,
            orderNumber: order.orderNumber,
            subject,
            description,
            category
        }
    });
});
