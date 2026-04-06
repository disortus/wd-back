import { Router } from "express";
import orderRouter from "./order.routes.js";
import productRouter from "./product.routes.js";
import { getSalesAnalytics } from "../../controllers/moderator/analytics.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";
import { USER_ROLE_TYPES } from "../../utils/enums.js";

const router = Router();

// All routes require moderator or admin role
router.use(requireAuth);
router.use(allowRoles(USER_ROLE_TYPES.MODERATOR, USER_ROLE_TYPES.ADMIN));

// Order routes
router.use("/orders", orderRouter);

// Product routes (moderator can view stock and increase)
router.use("/products", productRouter);

// GET /api/moderator/analytics/sales - Get sales analytics
router.get("/analytics/sales", getSalesAnalytics);

export default router;
