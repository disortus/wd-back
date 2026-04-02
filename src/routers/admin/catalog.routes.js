import { Router } from "express";

import {

  getCatalogAdmin,

  toggleCategory,

  toggleSubcategory

} from "../../controllers/admin/catalog.controller.js";


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


router.get("/", getCatalogAdmin);

router.patch(
  "/categories/:slug/toggle",
  toggleCategory
);

router.patch(
  "/subcategories/:slug/toggle",
  toggleSubcategory
);


export default router;