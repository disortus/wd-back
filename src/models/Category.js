import mongoose from "mongoose";
import { DB_MODELS, CATEGORY_TYPES_LIST } from "../utils/enums.js";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    slug: {
        type: String,
        unique: true,
        required: true,
        enum: CATEGORY_TYPES_LIST,
        index: true
    },

    image: {
        type: String,
        default: ""
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model(DB_MODELS.CATEGORY, categorySchema);