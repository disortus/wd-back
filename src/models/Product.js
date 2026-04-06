import mongoose from "mongoose";
import { CATEGORY_TYPES_LIST, DB_MODELS, SUBCATEGORY_TYPES_LIST } from "../utils/enums.js";

const productAttributeSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        trim: true
    },
    label: {
        type: String,
        required: true,
        trim: true
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
        type: [productAttributeSchema],
        default: []
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

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

productShema.pre("save", function() {
    const uniqueImages = [...new Set((this.images || []).filter(Boolean))];
    this.images = uniqueImages;

    if (!this.mainImage && uniqueImages.length > 0) {
        this.mainImage = uniqueImages[0];
    }

    if (this.mainImage && !uniqueImages.includes(this.mainImage)) {
        this.images = [this.mainImage, ...uniqueImages];
    }
});

productShema.index({ categorySlug: 1, subcategorySlug: 1 });
productShema.index({ title: "text", description: "text" });

export default mongoose.model(DB_MODELS.PRODUCT, productShema);