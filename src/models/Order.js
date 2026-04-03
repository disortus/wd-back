import mongoose from "mongoose";
import { DB_MODELS, ORDER_STATUS_TYPES_LIST, ORDER_STATUS_TYPES } from "../utils/enums.js";

const orderItemAttributesSchema = new mongoose.Schema({
    key: { 
        type: String, 
        required: true 
    },
    label: { 
        type: String,
        required: true
    },
    value: { 
        type: mongoose.Schema.Types.Mixed, 
        required: true 
    },
    unit: {
        type: String, 
        default: null 
    }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.PRODUCT,
        required: true
    },

    productSnapshot: {
        title: { 
            type: String, 
            required: true 
        },
        slug: { 
            type: String,
            required: true
        },
        image: { 
            type: String, 
            default: "" 
        }
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    priceSnapshot: {
        type: Number,
        required: true,
        min: 0
    },

    attributesSnapshot: {
        type: [orderItemAttributesSchema],
        default: []
    },

    subtotal: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: true });

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.USER,
        required: true,
        index: true
    },

    userSnapshot: {
        fullname: { type: String, required: true },
        phone: { type: String, required: true }
    },

    items: {
        type: [orderItemSchema],
        required: true,
        validate: [arr => arr.length > 0, "Order must have at least one item"]
    },

    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },

    deliveryAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },

    recipientName: {
        type: String,
        required: true
    },

    recipientPhone: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ORDER_STATUS_TYPES_LIST,
        default: ORDER_STATUS_TYPES.CREATED,
        index: true
    },

    statusHistory: [{
        status: { type: String, enum: ORDER_STATUS_TYPES_LIST },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: DB_MODELS.USER },
        note: { type: String, default: "" }
    }],

    moderator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.USER,
        default: null
    },

    courier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.USER,
        default: null
    },

    deliveryNote: {
        type: String,
        default: ""
    },

    deliveredAt: {
        type: Date,
        default: null
    },

    canceledAt: {
        type: Date,
        default: null
    },

    cancelReason: {
        type: String,
        default: ""
    }
}, { timestamps: true });

// Generate order number before saving
orderSchema.pre("validate", async function() {
    if (!this.orderNumber) {
        const count = await mongoose.model(DB_MODELS.ORDER).countDocuments();

        const timestamp = Date.now().toString(36).toUpperCase();

        const random = Math.random().toString(36).substring(2, 6).toUpperCase();

        this.orderNumber = `ORD-${timestamp}-${random}-${String(count + 1).padStart(4, "0")}`;
    }
});

// Update status history on status change
orderSchema.pre("save", function() {
    if (this.isNew) {
        this.statusHistory.push({
            status: this.status,
            changedAt: new Date()
        });
    }
    else if (this.isModified("status")) {
        this.statusHistory.push({
            status: this.status,
            changedAt: new Date()
        });
    }
});

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ moderator: 1, status: 1 });
orderSchema.index({ courier: 1, status: 1 });

export default mongoose.model(DB_MODELS.ORDER, orderSchema);
