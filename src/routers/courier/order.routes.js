import { Router } from "express";
import { 
    getAvailableOrders, 
    getMyOrders, 
    getOrder, 
    acceptOrder, 
    startDelivery, 
    markDelivered,
    updateDeliveryStatus,
    getDeliveryStats
} from "../../controllers/courier/order.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";
import { USER_ROLE_TYPES } from "../../utils/enums.js";

const router = Router();

// All routes require courier role
router.use(requireAuth);
router.use(allowRoles(USER_ROLE_TYPES.COURIER, USER_ROLE_TYPES.ADMIN));

// GET /api/courier/orders
router.get("/", getMyOrders);

// GET /api/courier/orders/available
router.get("/available", getAvailableOrders);

// GET /api/courier/orders/stats
router.get("/stats", getDeliveryStats);

// GET /api/courier/orders/:id
router.get("/:id", getOrder);

// POST /api/courier/orders/:id/accept
router.post("/:id/accept", acceptOrder);

// POST /api/courier/orders/:id/start
router.post("/:id/start", startDelivery);

// POST /api/courier/orders/:id/delivered
router.post("/:id/delivered", markDelivered);

// PATCH /api/courier/orders/:id/status
router.patch("/:id/status", updateDeliveryStatus);

export default router;
