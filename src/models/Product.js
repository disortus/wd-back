import mongoose from "mongoose";
import { CATEGORY_TYPES_LIST, DB_MODELS, SUBCATEGORY_TYPES_LIST } from "../utils/enums.js";

const productShema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    categorySlug: {
        type: String,
        required: true,
        enum: CATEGORY_TYPES_LIST,
        index: true
    },

    subcategorySlug: {
        type: String,
        required: true,
        enum: SUBCATEGORY_TYPES_LIST,
        index: true
    },

    attributes: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },

    description: {
        type: String,
        default: ""
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    stock: {
        type: Number,
        default: 0,
        min: 0
    },

    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.CATEGORY,
        required: true
    },

    images: {
        type: [String],
        default: []
    },

    mainImage: {
        type: String,
        default: ""
    },

    specs: {
        type: Object
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

productShema.index({ categorySlug: 1, subcategorySlug: 1 });
productShema.index({ title: "text", description: "text" });

export default mongoose.model(DB_MODELS.PRODUCT, productShema);