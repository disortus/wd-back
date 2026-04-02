import { Router } from "express";
import { createUser, updateUser, getUsers, deleteUser } from "../../controllers/admin.controller.js";
import { createUserValidator, updateUserValidator, idParamValidator } from "../../validators/admin.validator.js";
import { USER_ROLE_TYPES } from "../../utils/enums.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";

const router = Router();

// Swagger docs
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: admin endpoints
 */


/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: create user with role
 *     tags: [Admin]
 *
 *     security:
 *       - bearerAuth: []
 */

// GETs
router.get("/users", requireAuth, allowRoles(USER_ROLE_TYPES.ADMIN), getUsers);

// POSTs
router.post("/users", requireAuth, allowRoles(USER_ROLE_TYPES.ADMIN), createUserValidator, validate, createUser);

// PATCHs
router.patch("/users/:id", requireAuth, allowRoles(USER_ROLE_TYPES.ADMIN), updateUserValidator, validate, updateUser);

// DELETEs
router.delete("/users/:id", requireAuth, allowRoles(USER_ROLE_TYPES.ADMIN), idParamValidator, validate, deleteUser);

// TODO: add more features and dashboards

export default router;