import mongoose from "mongoose";
import { DB_MODELS } from "../utils/enums.js";

const cartItemAttributesSchema = new mongoose.Schema({
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

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.PRODUCT,
        required: true
    },

    productSnapshot: {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String, default: "" }
    },

    priceSnapshot: {
        type: Number,
        required: true,
        min: 0
    },

    attributesSnapshot: {
        type: [cartItemAttributesSchema],
        default: []
    },
    
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: DB_MODELS.USER,
        required: true,
        unique: true,
        index: true
    },

    items: {
        type: [cartItemSchema],
        default: []
    },

    totalItems: {
        type: Number,
        default: 0
    },

    subtotal: {
        type: Number,
        default: 0,
        min: 0
    }
}, { timestamps: true });

// Update totals before saving
cartSchema.pre("save", function() {
    this.totalItems = this.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    this.subtotal = this.items.reduce(
        (sum, item) => sum + item.priceSnapshot * item.quantity,
        0
    );
});

// Method to recalculate cart totals
cartSchema.methods.recalculateTotals = function() {
    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.subtotal = this.items.reduce((sum, item) => sum + (item.priceSnapshot * item.quantity), 0);
    return this;
};

// Method to add item to cart
cartSchema.methods.addItem = async function(product, quantity = 1, attributes = {}) {
    const existingIndex = this.items.findIndex(item => 
        item.product.toString() === product._id.toString() &&
        JSON.stringify(item.attributesSnapshot) === JSON.stringify(attributes)
    );

    if (existingIndex > -1) {
        this.items[existingIndex].quantity += quantity;
    } else {
        this.items.push({
            product: product._id,
            productSnapshot: {
                title: product.title,
                slug: product.slug,
                image: product.images?.[0] || ""
            },
            priceSnapshot: product.price,
            attributesSnapshot: attributes,
            quantity
        });
    }

    this.recalculateTotals();
    return this;
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
    const item = this.items.find(item => item.product.toString() === productId.toString());

    if (item) {
        if (quantity <= 0) {
            this.items = this.items.filter(i => i.product.toString() !== productId.toString());
        } else {
            item.quantity = quantity;
        }

        this.recalculateTotals();
    }
    
    return this;
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
    this.items = this.items.filter(item => item.product.toString() !== productId.toString());
    this.recalculateTotals();
    return this;
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
    this.items = [];
    this.totalItems = 0;
    this.subtotal = 0;
    return this;
};

// Static method to get or create cart for user
cartSchema.statics.getOrCreateCart = async function(userId) {
    let cart = await this.findOne({ user: userId });
    if (!cart) {
        cart = await this.create({ user: userId });
    }
    return cart;
};

export default mongoose.model(DB_MODELS.CART, cartSchema);
