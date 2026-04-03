import { Router } from "express";

import {
  increaseStock,
  getProductsModerator
} from "../../controllers/moderator/product.controller.js";

import {
  idParamValidator,
  stockValidator
} from "../../validators/product.validator.js";

import {
  validate
} from "../../middleware/validation.middleware.js";

import {
  requireAuth
} from "../../middleware/auth.middleware.js";

import {
  allowRoles
} from "../../middleware/role.middleware.js";


const router = Router();

router.use(
  requireAuth,
  allowRoles("moderator")
);

// Get all products (moderator can view stock levels)
router.get("/", getProductsModerator);

// Increase product stock (moderator can only add, not remove)
router.patch(
  "/:id/increase-stock",
  idParamValidator,
  stockValidator,
  validate,
  increaseStock
);


export default router;