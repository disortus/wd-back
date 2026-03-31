import { Router } from "express";
import authRouter from "./auth.routes.js";
import categoryRouter from "./category.routes.js";

const router = Router();

// Auth routes
router.use("/auth", authRouter);

// Categories routes
router.use("/categories", categoryRouter);

// TODO: add other routes

export default router;