import mongoose from "mongoose";
import { DB_MODELS } from "../utils/enums.js";

const productShema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
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
        ref: DB_MODELS.CATEGORY,
        required: true
    },

    image: {
        type: [String]
    },

    specs: {
        type: Object
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model("Product", productShema);