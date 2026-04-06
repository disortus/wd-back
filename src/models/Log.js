import mongoose from "mongoose";
import { DB_MODELS, USER_ROLE_TYPES_LIST } from "../utils/enums.js";

const logSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },

    level: {
        type: String,
        enum: ["info", "warn", "error", "debug"],
        default: "info",
        index: true
    },

    action: {
        type: String,
        required: true,
        index: true
    },

    method: {
        type: String,
        enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        required: true
    },

    path: {
        type: String,
        required: true
    },

    statusCode: {
        type: Number,
        default: null
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.USER,
        default: null,
        index: true
    },

    userRole: {
        type: String,
        enum: USER_ROLE_TYPES_LIST,
        default: null
    },

    ip: {
        type: String,
        default: ""
    },

    userAgent: {
        type: String,
        default: ""
    },

    requestBody: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },

    responseTime: {
        type: Number,
        default: null
    },

    errorMessage: {
        type: String,
        default: null
    },

    stackTrace: {
        type: String,
        default: null
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });

// Indexes for efficient querying
logSchema.index({ level: 1, timestamp: -1 });
logSchema.index({ action: 1, timestamp: -1 });
logSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model("Log", logSchema);
