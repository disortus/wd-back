import { Router } from "express";

import {

  getCatalogTree

} from "../../controllers/public/catalog.controller.js";


const router = Router();

router.get("/tree", getCatalogTree);

export default router;