import { Router } from "express";
import catalogRouter from "./catalog.routes.js";
import productRouter from "./product.routes.js";
import adminRouter from "./admin.routes.js"

const router = Router();

router.use(adminRouter);

router.use("/catalog", catalogRouter);

router.use("/products", productRouter);

export default router;