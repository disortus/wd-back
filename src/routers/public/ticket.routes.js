import { Router } from "express";
import { 
    createTicket, 
    getMyTickets, 
    getMyTicket, 
    addTicketMessage,
    rateTicket 
} from "../../controllers/public/ticket.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { 
    createTicketValidator, 
    ticketIdParamValidator,
    addTicketMessageValidator,
    rateTicketValidator
} from "../../validators/ticket.validator.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// POST /api/public/tickets
router.post("/", createTicketValidator, validate, createTicket);

// GET /api/public/tickets
router.get("/", getMyTickets);

// GET /api/public/tickets/:id
router.get("/:id", ticketIdParamValidator, validate, getMyTicket);

// POST /api/public/tickets/:id/messages
router.post("/:id/messages", addTicketMessageValidator, validate, addTicketMessage);

// POST /api/public/tickets/:id/rate
router.post("/:id/rate", rateTicketValidator, validate, rateTicket);

export default router;