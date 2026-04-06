import { Router } from "express";
import {
    getMe,
    updateMe,
    updateEmail,
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
import { validate } from "../../middleware/validation.middleware.js";
import { updateEmailValidator } from "../../validators/profile.validator.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Profile
router.get("/me", getMe);
router.patch("/me", updateMe);
router.patch("/email", updateEmailValidator, validate, updateEmail);
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
