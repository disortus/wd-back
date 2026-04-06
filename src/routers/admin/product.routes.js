import { Router } from "express";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsAdmin,
  increaseStock,
  decreaseStock,
  uploadProductImages,
  deleteProductImage
} from "../../controllers/admin/product.controller.js";

import {
  createProductValidator,
  updateProductValidator,
  idParamValidator,
  stockValidator,
  imagesValidator
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

import { upload } from "../../utils/file-upload.js";


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

// Upload images to existing product
router.post(
  "/:id/images",
  idParamValidator,
  validate,
  upload.array("images", 10),
  uploadProductImages
);

// Update product (after image upload)
router.patch(
  "/:id",
  updateProductValidator,
  validate,
  updateProduct
);

// Delete single image from product
router.delete(
  "/:id/images/:imageIndex",
  idParamValidator,
  validate,
  deleteProductImage
);

router.delete(
  "/:id",
  idParamValidator,
  validate,
  deleteProduct
);

// Stock management routes
router.patch(
  "/:id/increase-stock",
  idParamValidator,
  stockValidator,
  validate,
  increaseStock
);

router.patch(
  "/:id/decrease-stock",
  idParamValidator,
  stockValidator,
  validate,
  decreaseStock
);


export default router;
