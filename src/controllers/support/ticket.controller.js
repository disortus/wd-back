import SupportTicket from "../../models/SupportTicket.js";
import { TICKET_STATUS_TYPES } from "../../utils/enums.js";
import { AppError } from "../../utils/app-errors.js";
import { asyncHandler } from "../../utils/async-handler.js";

// Get open tickets
export const getOpenTickets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, priority, category } = req.query;

    const query = { status: TICKET_STATUS_TYPES.OPEN };

    if (priority) {
        query.priority = priority;
    }

    if (category) {
        query.category = category;
    }

    const tickets = await SupportTicket.find(query)
        .populate("user", "fullname phone")
        .sort({ priority: -1, createdAt: 1 }) // High priority first, then oldest
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

// Get all tickets assigned to this support agent
export const getMyTickets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;

    const query = { assignedTo: req.auth.id };

    if (status) {
        query.status = status;
    }

    const tickets = await SupportTicket.find(query)
        .populate("user", "fullname phone")
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
export const getTicket = asyncHandler(async (req, res) => {
    const ticket = await SupportTicket.findById(req.params.id)
        .populate("user", "fullname phone")
        .populate("assignedTo", "fullname phone");

    if (!ticket) {
        throw new AppError(404, "Ticket not found");
    }

    res.json({
        ok: true,
        data: ticket
    });
});

// Accept ticket (assign to self)
export const acceptTicket = asyncHandler(async (req, res) => {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
        throw new AppError(404, "Ticket not found");
    }

    if (ticket.status !== TICKET_STATUS_TYPES.OPEN) {
        throw new AppError(400, "Ticket is not open");
    }

    if (ticket.assignedTo && ticket.assignedTo.toString() !== req.auth.id) {
        throw new AppError(400, "Ticket already assigned to another agent");
    }

    // TODO: what a assignTo
    // TODO: make shure that it works right
    ticket.assignTo(req.user);

    await ticket.save();

    res.json({
        ok: true,
        data: ticket
    });
});

// Release ticket (unassign from self)
export const releaseTicket = asyncHandler(async (req, res) => {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
        throw new AppError(404, "Ticket not found");
    }

    if (ticket.assignedTo?.toString() !== req.auth.id) {
        throw new AppError(403, "You are not assigned to this ticket");
    }

    if (ticket.status === TICKET_STATUS_TYPES.RESOLVED || 
        ticket.status === TICKET_STATUS_TYPES.CLOSED) {
        throw new AppError(400, "Cannot release resolved or closed tickets");
    }

    ticket.release();

    await ticket.save();

    res.json({
        ok: true,
        data: ticket
    });
});

// Add message to ticket
export const addMessage = asyncHandler(async (req, res) => {
    const { message, attachments = [] } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
        throw new AppError(404, "Ticket not found");
    }

    if (ticket.status === TICKET_STATUS_TYPES.CLOSED) {
        throw new AppError(400, "Cannot add messages to closed ticket");
    }

    // If not assigned, auto-assign
    if (!ticket.assignedTo) {
        // TODO: what a assignTo
        // TODO: make shure that it works right
        ticket.assignTo(req.user);
    } else if (ticket.assignedTo.toString() !== req.auth.id) {
        throw new AppError(403, "Ticket is assigned to another agent");
    }

    // TODO: what a addMessage
    // TODO: make shure that it works right
    ticket.addMessage(
        { _id: req.auth.id, role: req.auth.role },
        req.user.fullname,
        message,
        attachments
    );

    await ticket.save();

    res.json({
        ok: true,
        data: ticket
    });
});

// Resolve ticket
export const resolveTicket = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
        throw new AppError(404, "Ticket not found");
    }

    if (ticket.assignedTo?.toString() !== req.auth.id) {
        throw new AppError(403, "You are not assigned to this ticket");
    }

    if (ticket.status === TICKET_STATUS_TYPES.CLOSED) {
        throw new AppError(400, "Ticket is already closed");
    }

    ticket.resolve();

    if (message) {
        // TODO: what a addMessage
        // TODO: make shure that it works right
        ticket.addMessage(
            { _id: req.auth.id, role: req.auth.role },
            req.user.fullname,
            message,
            []
        );
    }

    await ticket.save();

    res.json({
        ok: true,
        data: ticket
    });
});

// Close ticket
export const closeTicket = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
        throw new AppError(404, "Ticket not found");
    }

    if (ticket.assignedTo?.toString() !== req.auth.id) {
        throw new AppError(403, "You are not assigned to this ticket");
    }

    if (ticket.status === TICKET_STATUS_TYPES.CLOSED) {
        throw new AppError(400, "Ticket is already closed");
    }

    ticket.close();

    if (message) {
        // TODO: what a addMessage
        // TODO: make shure that it works right
        ticket.addMessage(
            { _id: req.auth.id, role: req.auth.role },
            req.user.fullname,
            message,
            []
        );
    }

    await ticket.save();

    res.json({
        ok: true,
        data: ticket
    });
});

// Reopen ticket (from resolved)
export const reopenTicket = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
        throw new AppError(404, "Ticket not found");
    }

    if (ticket.status !== TICKET_STATUS_TYPES.RESOLVED) {
        throw new AppError(400, "Only resolved tickets can be reopened");
    }

    ticket.status = TICKET_STATUS_TYPES.ASSIGNED;
    ticket.resolvedAt = null;

    if (reason) {
        // TODO: what a addMessage
        // TODO: make shure that it works right
        ticket.addMessage(
            { _id: req.auth.id, role: req.auth.role },
            req.user.fullname,
            `Reopened: ${reason}`,
            []
        );
    }

    await ticket.save();

    res.json({
        oks: true,
        data: ticket
    });
});

// Get support statistics
export const getSupportStats = asyncHandler(async (req, res) => {
    const open = await SupportTicket.countDocuments({ status: TICKET_STATUS_TYPES.OPEN });

    const myAssigned = await SupportTicket.countDocuments({
        assignedTo: req.auth.id,
        status: { $in: [TICKET_STATUS_TYPES.ASSIGNED, TICKET_STATUS_TYPES.OPEN] }
    });

    const myResolved = await SupportTicket.countDocuments({
        assignedTo: req.auth.id,
        status: TICKET_STATUS_TYPES.RESOLVED
    });

    const myClosed = await SupportTicket.countDocuments({
        assignedTo: req.auth.id,
        status: TICKET_STATUS_TYPES.CLOSED
    });

    const avgResolutionTime = await SupportTicket.aggregate([
        {
            $match: {
                assignedTo: req.auth.id,
                status: { $in: [TICKET_STATUS_TYPES.RESOLVED, TICKET_STATUS_TYPES.CLOSED] },
                resolvedAt: { $ne: null }
            }
        },
        {
            $project: {
                resolutionTime: { $subtract: ["$resolvedAt", "$createdAt"] }
            }
        },
        {
            $group: {
                _id: null,
                avgTime: { $avg: "$resolutionTime" }
            }
        }
    ]);

    res.json({
        ok: true,
        data: {
            open,
            myAssigned,
            myResolved,
            myClosed,
            avgResolutionTimeMs: avgResolutionTime[0]?.avgTime || 0
        }
    });
});
