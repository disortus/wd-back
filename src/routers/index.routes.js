import { Router } from "express";
import authRouter from "./auth.routes.js";
import categoryRouter from "./category.routes.js";
import productRouter from "./product.routes.js";

const router = Router();

// Auth routes
router.use("/auth", authRouter);

// Categories routes
router.use("/categories", categoryRouter);

// Products routes
router.use("/products", productRouter);

// TODO: add other routes

export default router;

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