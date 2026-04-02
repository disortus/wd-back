import { Router } from "express";
import { 
    seedCatalog, 
    getCategories, 
    toggleCategoryActive, 
    toggleSubcategoryActive,
    getCatalogStructure
} from "../../controllers/admin/catalog.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";
import { USER_ROLE_TYPES } from "../../utils/enums.js";

const router = Router();

// All routes require admin role
router.use(requireAuth);
router.use(allowRoles(USER_ROLE_TYPES.ADMIN));

// GET /api/admin/catalog/structure
router.get("/structure", getCatalogStructure);

// GET /api/admin/catalog
router.get("/", getCategories);

// POST /api/admin/catalog/seed
router.post("/seed", seedCatalog);

// PATCH /api/admin/catalog/categories/:id/toggle
router.patch("/categories/:id/toggle", toggleCategoryActive);

// PATCH /api/admin/catalog/subcategories/:id/toggle
router.patch("/subcategories/:id/toggle", toggleSubcategoryActive);

export default router;
