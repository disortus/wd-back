import { Router } from "express";
import ticketRouter from "./ticket.routes.js";

const router = Router();

// Ticket routes
router.use("/tickets", ticketRouter);

export default router;
