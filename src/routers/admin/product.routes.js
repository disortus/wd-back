import { Router } from "express";

import {

  createProduct,

  updateProduct,

  deleteProduct,

  getProductsAdmin

} from "../../controllers/admin/product.controller.js";


import {

  createProductValidator,

  updateProductValidator,

  idParamValidator

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
  allowRoles("admin")
);


router.get("/", getProductsAdmin);

router.post(
  "/",
  createProductValidator,
  validate,
  createProduct
);

router.patch(
  "/:id",
  updateProductValidator,
  validate,
  updateProduct
);

router.delete(
  "/:id",
  idParamValidator,
  validate,
  deleteProduct
);


export default router;