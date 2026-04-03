import mongoose from "mongoose";
import { DB_MODELS, TICKET_STATUS_TYPES_LIST, TICKET_STATUS_TYPES } from "../utils/enums.js";

const ticketMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.USER,
        required: true
    },
    senderRole: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    attachments: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const ticketSchema = new mongoose.Schema({
    ticketNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.USER,
        required: true,
        index: true
    },

    userSnapshot: {
        fullname: { type: String, required: true },
        phone: { type: String, required: true }
    },

    subject: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: String,
        enum: ["order", "product", "delivery", "payment", "account", "technical", "other"],
        default: "other"
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },

    status: {
        type: String,
        enum: TICKET_STATUS_TYPES_LIST,
        default: TICKET_STATUS_TYPES.OPEN,
        index: true
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.USER,
        default: null
    },

    assignedToSnapshot: {
        fullname: { type: String, default: "" },
        phone: { type: String, default: "" }
    },

    assignedAt: {
        type: Date,
        default: null
    },

    messages: {
        type: [ticketMessageSchema],
        default: []
    },

    statusHistory: [{
        status: { type: String, enum: TICKET_STATUS_TYPES_LIST },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.USER },
        note: { type: String, default: "" }
    }],

    resolvedAt: {
        type: Date,
        default: null
    },

    closedAt: {
        type: Date,
        default: null
    },

    relatedOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.ORDER,
        default: null
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },

    feedback: {
        type: String,
        default: ""
    }
}, { timestamps: true });

// Generate ticket number before saving
ticketSchema.pre("validate", async function() {

    if (!this.ticketNumber) {
        const count = await this.constructor.countDocuments();

        const timestamp = Date.now().toString(36).toUpperCase();

        const random = Math.random().toString(36).substring(2, 6).toUpperCase();

        this.ticketNumber = `TKT-${timestamp}-${random}-${String(count + 1).padStart(4, "0")}`;
    }
});

// Update status history on status change
ticketSchema.pre("save", function() {
    if (this.isNew || this.isModified("status")) {
        this.statusHistory.push({
            status: this.status,
            changedAt: new Date()
        });
    }
});

// Method to add message to ticket
ticketSchema.methods.addMessage = function(sender, senderName, message, attachments = []) {
    this.messages.push({
        sender: sender._id,
        senderRole: sender.role,
        senderName,
        message,
        attachments
    });
    return this;
};

// Method to assign ticket to support agent
ticketSchema.methods.assignTo = function(agent) {
    this.assignedTo = agent._id;
    this.assignedToSnapshot = {
        fullname: agent.fullname,
        phone: agent.phone
    };
    this.assignedAt = new Date();
    this.status = TICKET_STATUS_TYPES.ASSIGNED;
    return this;
};

// Method to release ticket (agent releases assignment)
ticketSchema.methods.release = function() {
    this.assignedTo = null;
    this.assignedToSnapshot = {
        fullname: "",
        phone: ""
    };
    this.assignedAt = null;
    this.status = TICKET_STATUS_TYPES.OPEN;
    return this;
};

// Method to resolve ticket
ticketSchema.methods.resolve = function() {
    this.status = TICKET_STATUS_TYPES.RESOLVED;
    this.resolvedAt = new Date();
    return this;
};

// Method to close ticket
ticketSchema.methods.close = function() {
    this.status = TICKET_STATUS_TYPES.CLOSED;
    this.closedAt = new Date();
    return this;
};

// Indexes
ticketSchema.index({ user: 1, createdAt: -1 });
ticketSchema.index({ status: 1, assignedTo: 1 });
ticketSchema.index({ priority: 1, status: 1 });
ticketSchema.index({ category: 1, status: 1 });

export default mongoose.model(DB_MODELS.SUPPORT_TICKET, ticketSchema);
