import mongoose from "mongoose";
import { DB_MODELS, SUBCATEGORY_TYPES_LIST, CATEGORY_TYPES_LIST } from "../utils/enums";

const subcategorySchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        enum: SUBCATEGORY_TYPES_LIST
    },

    name: {
        type:String,
        required: true,
        trim: true
    },

    categorySlug: {
        type: String,
        required: true,
        enum: CATEGORY_TYPES_LIST
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

subcategorySchema.index({ slug: 1, categorySlug: 1}, { unique: true });

export default mongoose.model(DB_MODELS.SUBCATEGORY, subcategorySchema);