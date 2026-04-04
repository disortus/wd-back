import SupportTicket from "../../models/SupportTicket.js";
import Order from "../../models/Order.js";
import { TICKET_STATUS_TYPES } from "../../utils/enums.js";
import { AppError } from "../../utils/app-errors.js";
import { asyncHandler } from "../../utils/async-handler.js";

// Create support ticket
import User from "../../models/User.js";

export const createTicket = asyncHandler(async (req, res) => {
    const {
        subject,
        description,
        category = "other",
        priority = "medium",
        relatedOrderId
    } = req.body;

    if (relatedOrderId) {
        const order = await Order.findOne({
            _id: relatedOrderId,
            userId: req.auth.id
        });

        if (!order) {
            throw new AppError(404, "Order not found");
        }
    }

    const user = await User.findById(req.auth.id).select("fullname phone");

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const ticket = await SupportTicket.create({
        user: req.auth.id,
        userSnapshot: {
            fullname: user.fullname,
            phone: user.phone
        },
        subject,
        description,
        category,
        priority,
        relatedOrder:
            relatedOrderId || null
    });

    res.status(201).json({
        ok: true,
        data: ticket
    });
});

// Get user's tickets
export const getMyTickets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.auth.id };

    if (status) {
        query.status = status;
    }

    const tickets = await SupportTicket.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await SupportTicket.countDocuments(query);

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

// Get single ticket
export const getMyTicket = asyncHandler(async (req, res) => {
    const ticket = await SupportTicket.findOne({
        _id: req.params.id,
        user: req.auth.id
    });

    if (!ticket) {
        throw new AppError(404, "Ticket not found");
    }

    res.json({
        ok: true,
        data: ticket
    });
});

// Add message to ticket
export const addTicketMessage = asyncHandler(async (req, res) => {
    const { message, attachments = [] } = req.body || {};

    if (!message) {
        throw new AppError(400, "Message is required");
    }

    const ticket = await SupportTicket.findOne({
        _id: req.params.id,
        user: req.auth.id
    });

    if (!ticket) {
        throw new AppError(404, "Ticket not found");
    }

    // Can't add messages to closed tickets
    if (ticket.status === TICKET_STATUS_TYPES.CLOSED) {
        throw new AppError(400, "Cannot add messages to closed ticket");
    }

    const user = await User.findById(req.auth.id).select("fullname");

    if (!user) {
        throw new AppError(404, "User not found");
    }

    ticket.addMessage(
        { _id: req.auth.id, role: req.auth.role },
        user.fullname,
        message,
        attachments
    );

    await ticket.save();

    res.json({
        ok: true,
        data: ticket
    });
});

// Rate resolved ticket
export const rateTicket = asyncHandler(async (req, res) => {
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        throw new AppError(400, "Rating must be between 1 and 5");
    }

    const ticket = await SupportTicket.findOne({
        _id: req.params.id,
        user: req.auth.id
    });

    if (!ticket) {
        throw new AppError(404, "Ticket not found");
    }

    if (ticket.status !== TICKET_STATUS_TYPES.RESOLVED && 
        ticket.status !== TICKET_STATUS_TYPES.CLOSED) {
        throw new AppError(400, "Can only rate resolved or closed tickets");
    }

    ticket.rating = rating;
    if (feedback) {
        ticket.feedback = feedback;
    }

    await ticket.save();

    res.json({
        ok: true,
        data: ticket
    });
});
