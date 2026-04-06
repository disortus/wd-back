import { Router } from "express";
import catalogRouter from "./catalog.routes.js";
import productRouter from "./product.routes.js";
import adminRouter from "./admin.routes.js";
import userRouter from "./user.routes.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";
import { USER_ROLE_TYPES } from "../../utils/enums.js";
import { getSalesAnalytics, getStaffMetrics, getSystemOverview } from "../../controllers/admin/analytics.controller.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(allowRoles(USER_ROLE_TYPES.ADMIN));

// Mount sub-routers
router.use(adminRouter);
router.use("/catalog", catalogRouter);
router.use("/products", productRouter);
router.use("/users", userRouter);

// Analytics routes
router.get("/analytics/sales", getSalesAnalytics);
router.get("/analytics/staff", getStaffMetrics);
router.get("/analytics/overview", getSystemOverview);

export default router;
