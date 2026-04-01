import { Router } from "express";
import { cretaeCategory, updateCategory, deleteCategory, getCategories, getCategoryById } from "../controllers/catagory.controller.js";
import { createCategoryValidator, updateCategoryValidator, idParamValidator } from "../validators/category.validator.js";
import { USER_ROLE_TYPES } from "../utils/enums.js";
import { validate } from "../middleware/validation.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = Router();

// Swagger docs
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category endpoints
 */


/**
 * @swagger
 * /categories:
 *   get:
 *     summary: get all categories
 *     tags: [Categories]
 *
 *     responses:
 *
 *       200:
 *         description: list of categories
 *
 *         content:
 *           application/json:
 *
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: create category
 *     tags: [Categories]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       201:
 *         description: category created
 */

// GETs
router.get("/", getCategories);

router.get("/:id", idParamValidator, validate, getCategoryById);

// ADMIN routes
// POSTs
router.post("/admin", requireAuth, allowRoles(USER_ROLE_TYPES.ADMIN), createCategoryValidator, validate, cretaeCategory);

// PATCHs
router.patch("/admin/:id", requireAuth, allowRoles(USER_ROLE_TYPES.ADMIN), updateCategoryValidator, validate, updateCategory);

// DELETEs
router.delete("/admin/:id", requireAuth, allowRoles(USER_ROLE_TYPES.ADMIN), idParamValidator, validate, deleteCategory);

export default router;