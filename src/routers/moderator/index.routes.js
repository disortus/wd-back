import { Router } from "express";
import orderRouter from "./order.routes.js";

const router = Router();

// Order routes
router.use("/orders", orderRouter);

export default router;
