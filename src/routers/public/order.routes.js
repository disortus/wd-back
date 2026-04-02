import { Router } from "express";
import { 
    createOrder, 
    getMyOrders, 
    getMyOrder, 
    cancelOrder 
} from "../../controllers/public/order.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// POST /api/public/orders
router.post("/", createOrder);

// GET /api/public/orders
router.get("/", getMyOrders);

// GET /api/public/orders/:id
router.get("/:id", getMyOrder);

// POST /api/public/orders/:id/cancel
router.post("/:id/cancel", cancelOrder);

export default router;
