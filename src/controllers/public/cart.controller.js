import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import { ATTRIBUTE_DEFINITIONS } from "../../utils/enums.js";
import { AppError } from "../../utils/app-errors.js";
import { asyncHandler } from "../../utils/async-handler.js";

// Get user's cart
export const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.getOrCreateCart(req.auth.id);

    res.json({
        ok: true,
        data: cart
    });
});

// Add item to cart
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1, attributes = [] } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        throw new AppError(404, "Product not found");
    }

    if (!product.isActive) {
        throw new AppError(400, "Product is not available");
    }

    if (product.stock < quantity) {
        throw new AppError(400, "Insufficient stock");
    }

    // Validate attributes for subcategory
    const validAttributes = ATTRIBUTE_DEFINITIONS[product.subcategorySlug] || [];

    const formattedAttributes = attributes.map(attr => {
        const attrDef = validAttributes.find(a => a.key === attr.key);

        if (!attrDef) {
            throw new AppError(400, `Invalid attribute key: ${attr.key}`);
        }

        return {
            key: attr.key,
            label: attrDef.label,
            value: attr.value,
            unit: attrDef.unit || null
        };
    });

    const cart = await Cart.getOrCreateCart(req.auth.id);

    // Check if same product with same attributes exists
    const existingIndex = cart.items.findIndex(item => 
        item.product.toString() === productId &&
        JSON.stringify(item.attributesSnapshot) === JSON.stringify(formattedAttributes)
    );

    if (existingIndex > -1) {
        const newQty = cart.items[existingIndex].quantity + quantity;

        if (product.stock < newQty) {
            throw new AppError(400, "Insufficient stock for requested quantity");
        }

        cart.items[existingIndex].quantity = newQty;
    } else {
        cart.items.push({
            product: product._id,
            productSnapshot: {
                title: product.title,
                slug: product.slug,
                image: product.images?.[0] || ""
            },
            priceSnapshot: product.price,
            attributesSnapshot: formattedAttributes,
            quantity
        });
    }

    cart.recalculateTotals();
    await cart.save();

    res.json({
        ok: true,
        data: cart
    });
});

// Update item quantity in cart
export const updateCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
        throw new AppError(400, "Quantity must be at least 1");
    }

    const cart = await Cart.getOrCreateCart(req.auth.id);
    const item = cart.items.find(item => item.product.toString() === productId);

    if (!item) {
        throw new AppError(404, "Item not found in cart");
    }

    // Verify stock
    const product = await Product.findById(productId);

    if (!product || product.stock < quantity) {
        throw new AppError(400, "Insufficient stock");
    }

    item.quantity = quantity;
    cart.recalculateTotals();

    await cart.save();

    res.json({
        ok: true,
        data: cart
    });
});

// Remove item from cart
export const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { attributes } = req.query;

    const cart = await Cart.getOrCreateCart(req.auth.id);

    if (attributes) {
        const parsedAttrs = JSON.parse(attributes);
        cart.items = cart.items.filter(item => 
            !(item.product.toString() === productId && 
              JSON.stringify(item.attributesSnapshot) === JSON.stringify(parsedAttrs))
        );
    } else {
        cart.items = cart.items.filter(item => 
            item.product.toString() !== productId
        );
    }

    cart.recalculateTotals();
    await cart.save();

    res.json({
        ok: true,
        data: cart
    });
});

// Clear cart
export const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.getOrCreateCart(req.auth.id);
    cart.clearCart();
    await cart.save();

    res.json({
        ok: true,
        data: cart
    });
});
