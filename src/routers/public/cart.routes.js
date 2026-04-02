import { Router } from "express";
import { 
    getCart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
} from "../../controllers/public/cart.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// GET /api/public/cart
router.get("/", getCart);

// POST /api/public/cart
router.post("/", addToCart);

// PATCH /api/public/cart/:productId
router.patch("/:productId", updateCartItem);

// DELETE /api/public/cart/:productId
router.delete("/:productId", removeFromCart);

// DELETE /api/public/cart
router.delete("/", clearCart);

export default router;
