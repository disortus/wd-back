import { Router } from "express";
import catalogRouter from "./catalog.routes.js";
import productRouter from "./product.routes.js";
import profileRouter from "./profile.routes.js";
import publicRouter from "./public.routes.js";
import cartRouter from "./cart.routes.js";
import orderRouter from "./order.routes.js";
import ticketRouter from "./ticket.routes.js";

const router = Router();

router.use(publicRouter);

router.use("/catalog", catalogRouter);

router.use("/products", productRouter);

router.use("/profile", profileRouter);

router.use("/cart", cartRouter);

router.use("/orders", orderRouter);

router.use("/tickets", ticketRouter);

export default router;
