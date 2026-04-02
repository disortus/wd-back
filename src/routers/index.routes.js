import { Router } from "express";
import authRouter from "./auth.routes.js";
import healthRouter from "./health.routes.js";
import adminRouter from "./admin/index.routes.js";
import publicRouter from "./public/index.routes";

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

// Health routes
router.use("/health", healthRouter);

// Public routes
router.use("/public", publicRouter);

// TODO: add other routes

export default router;

