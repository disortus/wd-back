import mongoose from "mongoose";
import { DB_MODELS } from "../utils/enums.js";

const cartItemSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.USER
    },

    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.PRODUCT
    },

    quantity: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

export default mongoose.model("CartItem", cartItemSchema);