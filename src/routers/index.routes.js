import { Router } from "express";
import authRouter from "./auth.routes.js";
import categoryRouter from "./category.routes.js";
import productRouter from "./product.routes.js";
import healthRouter from "./health.routes.js";
import publicRouter from "./public.routes.js";

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
router.use("/public", productRouter);

// TODO: add other routes

export default router;

