import { Router } from "express";
import {
    getMe,
    updateMe,
    getOrderHistory,
    getActiveOrders,
    getOrderTracking,
    getMyTickets,
    addAddress,
    updateAddress,
    deleteAddress,
    getUserStats
} from "../../controllers/profile.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Profile
router.get("/me", getMe);
router.patch("/me", updateMe);
router.get("/stats", getUserStats);

// Orders
router.get("/orders", getOrderHistory);
router.get("/orders/active", getActiveOrders);
router.get("/orders/:orderId/tracking", getOrderTracking);

// Tickets
router.get("/tickets", getMyTickets);

// Addresses
router.post("/addresses", addAddress);
router.patch("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);

export default router;
