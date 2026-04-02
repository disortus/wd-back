import { Router } from "express";
import { 
    createTicket, 
    getMyTickets, 
    getMyTicket, 
    addTicketMessage,
    rateTicket 
} from "../../controllers/public/ticket.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// POST /api/public/tickets
router.post("/", createTicket);

// GET /api/public/tickets
router.get("/", getMyTickets);

// GET /api/public/tickets/:id
router.get("/:id", getMyTicket);

// POST /api/public/tickets/:id/messages
router.post("/:id/messages", addTicketMessage);

// POST /api/public/tickets/:id/rate
router.post("/:id/rate", rateTicket);

export default router;
