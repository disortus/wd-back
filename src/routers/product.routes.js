import { Router } from "express";
import { createProductValidator, updateProductValidator, queryProductsValidator, idParamValidator } from "../validators/product.validator.js"
import { createProduct, updateProduct, deleteProduct, getProducts, getProductBySlug } from "../controllers/product.controller.js";
import { USER_ROLE_TYPES } from "../utils/enums.js";
import { validate } from "../middleware/validation.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = Router();

// Swagger docs
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product endpoints
 */


/**
 * @swagger
 * /products:
 *   get:
 *     summary: get products list
 *     tags: [Products]
 *
 *     parameters:
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: list of products
 *
 *         content:
 *           application/json:
 *
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 */

// GETs
router.get("/", queryProductsValidator, validate, getProducts);

router.get("/:slug", getProductBySlug);

// ADMIN routes
// POSTs
router.post("/admin", requireAuth, allowRoles(USER_ROLE_TYPES.ADMIN), createProductValidator, validate, createProduct);

// PATCHs
router.patch("/admin/:id", requireAuth, allowRoles(USER_ROLE_TYPES.ADMIN), updateProductValidator, validate, updateProduct);

// DELETEs
router.delete("/admin/:id", requireAuth, allowRoles(USER_ROLE_TYPES.ADMIN), idParamValidator, validate, deleteProduct);

export default router;