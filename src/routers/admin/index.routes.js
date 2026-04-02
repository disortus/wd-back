import { Router } from "express";
import catalogRouter from "./catalog.routes.js";
import productRouter from "./product.routes.js";
import adminRouter from "./admin.routes.js";
import userRouter from "./user.routes.js";

const router = Router();

router.use(adminRouter);

router.use("/catalog", catalogRouter);

router.use("/products", productRouter);

router.use("/users", userRouter);

export default router;
