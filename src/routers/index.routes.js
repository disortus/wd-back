import { Router } from "express";
import authRouter from "./auth.routes.js";
import categoryRouter from "./category.routes.js";
import productRouter from "./product.routes.js";
import healthRouter from "./health.routes.js";
import publicRouter from "./public.routes.js";
import profileRouter from "./profile.routes.js";

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

// Categories routes
router.use("/categories", categoryRouter);

// Products routes
router.use("/products", productRouter);

// Health routes
router.use("/health", healthRouter);

// Public routes
router.use("/public", publicRouter);

// Profile routes
router.use("/profile", profileRouter);

// TODO: add other routes

export default router;

