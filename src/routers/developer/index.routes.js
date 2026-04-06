import { Router } from "express";
import { 
    getLogs, 
    getLogStats 
} from "../../middleware/logging.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";
import { USER_ROLE_TYPES } from "../../utils/enums.js";

const router = Router();

// All routes require developer or admin role
router.use(requireAuth);
router.use(allowRoles(USER_ROLE_TYPES.DEVELOPER, USER_ROLE_TYPES.ADMIN));

// GET /api/developer/logs
router.get("/logs", getLogs);

// GET /api/developer/logs/stats
router.get("/logs/stats", getLogStats);

export default router;
