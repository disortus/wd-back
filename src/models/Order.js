import mongoose, { mongo, Mongoose } from "mongoose";
import { DB_MODELS, ORDER_STATUS_TYPES_LIST, ORDER_STATUS_TYPES } from "../utils/enums.js";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.PRODUCT
    },

    quantity: {
        type: Number
    },

    price: {
        type: Number
    }
});

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.USER
    },

    items: {
        type: [orderItemSchema]
    },

    totalPrice: {
        type: Number
    },

    deliveryAddress: {
        type: String
    },

    phone: {
        type: String
    },

    recipientName: {
        type: String
    },

    status: {
        type: String,
        enum: ORDER_STATUS_TYPES_LIST,
        default: ORDER_STATUS_TYPES.NEW
    },

    courier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.USER,
        default: null
    }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);