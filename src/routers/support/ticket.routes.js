import { Router } from "express";
import { 
    getOpenTickets, 
    getMyTickets, 
    getArchivedTickets,
    getTicket, 
    getTicketMessages,
    acceptTicket, 
    releaseTicket, 
    rejectTicket,
    addMessage,
    resolveTicket,
    closeTicket,
    reopenTicket,
    getSupportStats
} from "../../controllers/support/ticket.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { USER_ROLE_TYPES } from "../../utils/enums.js";
import {
    supportTicketIdParamValidator,
    supportAddMessageValidator,
    supportResolveCloseValidator,
    supportReopenValidator,
    supportRejectTicketValidator
} from "../../validators/ticket.validator.js";

const router = Router();

// All routes require support role
router.use(requireAuth);
router.use(allowRoles(USER_ROLE_TYPES.SUPPORT, USER_ROLE_TYPES.ADMIN));

// GET /api/support/tickets
router.get("/", getMyTickets);

// GET /api/support/tickets/open
router.get("/open", getOpenTickets);

// GET /api/support/tickets/archived
router.get("/archived", getArchivedTickets);

// GET /api/support/tickets/stats
router.get("/stats", getSupportStats);

// GET /api/support/tickets/:id
router.get("/:id", supportTicketIdParamValidator, validate, getTicket);

// GET /api/support/tickets/:id/messages
router.get("/:id/messages", supportTicketIdParamValidator, validate, getTicketMessages);

// POST /api/support/tickets/:id/accept
router.post("/:id/accept", supportTicketIdParamValidator, validate, acceptTicket);

// POST /api/support/tickets/:id/release
router.post("/:id/release", supportTicketIdParamValidator, validate, releaseTicket);

// POST /api/support/tickets/:id/reject
router.post("/:id/reject", supportRejectTicketValidator, validate, rejectTicket);

// POST /api/support/tickets/:id/message
router.post("/:id/message", supportAddMessageValidator, validate, addMessage);

// POST /api/support/tickets/:id/resolve
router.post("/:id/resolve", supportResolveCloseValidator, validate, resolveTicket);

// POST /api/support/tickets/:id/close
router.post("/:id/close", supportResolveCloseValidator, validate, closeTicket);

// POST /api/support/tickets/:id/reopen
router.post("/:id/reopen", supportReopenValidator, validate, reopenTicket);

export default router;
