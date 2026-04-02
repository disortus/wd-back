import { Router } from "express";
import catalogRouter from "./catalog.routes.js";
import productRouter from "./product.routes.js";
import profileRouter from "./profile.routes.js";
import publicRouter from "./public.routes.js";

const router = Router();

router.use(publicRouter);

router.use("/catalog", catalogRouter);

router.use("/products", productRouter);

router.use("/profile", profileRouter);

export default router;