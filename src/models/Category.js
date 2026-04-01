import mongoose, { mongo } from "mongoose";
import { DB_MODELS, CATEGORY_TYPES_LIST } from "../utils/enums";

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
        type: String
    }
}, { timestamps: true });

export default mongoose.model(DB_MODELS.CATEGORY, categorySchema);