import { Router } from "express";
import { 
    getUsers, 
    getUser, 
    createUser, 
    updateUser,
    toggleUserActive,
    deleteUser,
    getUsersByRole,
    getUserStats
} from "../../controllers/admin/user.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";
import { USER_ROLE_TYPES } from "../../utils/enums.js";

const router = Router();

// All routes require admin role
router.use(requireAuth);
router.use(allowRoles(USER_ROLE_TYPES.ADMIN));

// GET /api/admin/users/stats
router.get("/stats", getUserStats);

// GET /api/admin/users/role/:role
router.get("/role/:role", getUsersByRole);

// GET /api/admin/users
router.get("/", getUsers);

// POST /api/admin/users
router.post("/", createUser);

// GET /api/admin/users/:id
router.get("/:id", getUser);

// PATCH /api/admin/users/:id
router.patch("/:id", updateUser);

// PATCH /api/admin/users/:id/toggle
router.patch("/:id/toggle", toggleUserActive);

// DELETE /api/admin/users/:id
router.delete("/:id", deleteUser);

export default router;