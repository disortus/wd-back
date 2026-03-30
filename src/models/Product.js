import mongoose from "mongoose";
import { DB_MODELS } from "../utils/enums";

const productShema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        default: 0
    },

    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.CATEGORY
    },

    image: {
        type: [String]
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model("Product", productShema);