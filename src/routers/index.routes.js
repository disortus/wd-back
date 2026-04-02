import { Router } from "express";
import authRouter from "./auth.routes.js";
import healthRouter from "./health.routes.js";
import adminRouter from "./admin/index.routes.js";
import publicRouter from "./public/index.routes.js";
import moderatorRouter from "./moderator/index.routes.js";
import courierRouter from "./courier/index.routes.js";
import supportRouter from "./support/index.routes.js";

const router = Router();

// Swagger docs
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: create category
 *     tags: [Categories]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       201:
 *         description: category created
 */

// Auth routes
router.use("/auth", authRouter);

// Admin routes
router.use("/admin", adminRouter);

// Moderator routes
router.use("/moderator", moderatorRouter);

// Courier routes
router.use("/courier", courierRouter);

// Support routes
router.use("/support", supportRouter);

// Health routes
router.use("/health", healthRouter);

// Public routes
router.use("/public", publicRouter);

export default router;
