import { Router } from "express";
import { 
    getOpenTickets, 
    getMyTickets, 
    getTicket, 
    acceptTicket, 
    releaseTicket, 
    addMessage,
    resolveTicket,
    closeTicket,
    reopenTicket,
    getSupportStats
} from "../../controllers/support/ticket.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";
import { USER_ROLE_TYPES } from "../../utils/enums.js";

const router = Router();

// All routes require support role
router.use(requireAuth);
router.use(allowRoles(USER_ROLE_TYPES.SUPPORT, USER_ROLE_TYPES.ADMIN));

// GET /api/support/tickets
router.get("/", getMyTickets);

// GET /api/support/tickets/open
router.get("/open", getOpenTickets);

// GET /api/support/tickets/stats
router.get("/stats", getSupportStats);

// GET /api/support/tickets/:id
router.get("/:id", getTicket);

// POST /api/support/tickets/:id/accept
router.post("/:id/accept", acceptTicket);

// POST /api/support/tickets/:id/release
router.post("/:id/release", releaseTicket);

// POST /api/support/tickets/:id/message
router.post("/:id/message", addMessage);

// POST /api/support/tickets/:id/resolve
router.post("/:id/resolve", resolveTicket);

// POST /api/support/tickets/:id/close
router.post("/:id/close", closeTicket);

// POST /api/support/tickets/:id/reopen
router.post("/:id/reopen", reopenTicket);

export default router;
