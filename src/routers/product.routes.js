import { Router } from "express";
import { cretaeProductValidator, updateProductValidator, queryProductsValidator, idParamValidator } from "../validators/product.validator.js"
import { cretaeProduct, updateProduct, deleteProduct, getProducts, getProductBySlug } from "../controllers/product.controller.js";
import { USER_ROLE_TYPES } from "../utils/enums";
import { validate } from "../middleware/validation.middleware.js";
import { reqireAuth } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = Router();

// GETs
router.get("/", queryProductsValidator, validate, getProducts);

router.get("/:slug", getProductBySlug);

// ADMIN routes
// POSTs
router.post("/admin", reqireAuth, allowRoles(USER_ROLE_TYPES.ADMIN), cretaeProductValidator, validate, cretaeProduct);

// PATCHs
router.patch("/admin/:id", reqireAuth, allowRoles(USER_ROLE_TYPES.ADMIN), updateProductValidator, validate, updateProduct);

// DELETEs
router.delete("/admin/:id", reqireAuth, allowRoles(USER_ROLE_TYPES.ADMIN), idParamValidator, validate, deleteProduct);

export default router;

