import { Router } from "express";
import orderRouter from "./order.routes.js";
import productRouter from "./product.routes.js";

const router = Router();

// Order routes
router.use("/orders", orderRouter);

// Product routes (moderator can view stock and increase)
router.use("/products", productRouter);

export default router;