import { Router } from "express";
import { 
    getOrders, 
    getOrder, 
    acceptOrder, 
    packOrder, 
    getAvailableCouriers,
    assignToCourier,
    cancelOrder,
    getOrderStats
} from "../../controllers/moderator/order.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";
import { USER_ROLE_TYPES } from "../../utils/enums.js";

const router = Router();

// All routes require moderator role
router.use(requireAuth);
router.use(allowRoles(USER_ROLE_TYPES.MODERATOR, USER_ROLE_TYPES.ADMIN));

// GET /api/moderator/orders
router.get("/", getOrders);

// GET /api/moderator/orders/stats
router.get("/stats", getOrderStats);

// GET /api/moderator/couriers
router.get("/couriers", getAvailableCouriers);

// GET /api/moderator/orders/:id
router.get("/:id", getOrder);

// POST /api/moderator/orders/:id/accept
router.post("/:id/accept", acceptOrder);

// POST /api/moderator/orders/:id/pack
router.post("/:id/pack", packOrder);

// POST /api/moderator/orders/:id/assign
router.post("/:id/assign", assignToCourier);

// POST /api/moderator/orders/:id/cancel
router.post("/:id/cancel", cancelOrder);

export default router;
