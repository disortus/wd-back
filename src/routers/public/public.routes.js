import { Router } from "express";
import { getHome } from "../controllers/public.controller.js";

const router = Router();

// Swagger docs
/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Public endpoints
 */


/**
 * @swagger
 * /public/home:
 *   get:
 *     summary: home page data
 *     tags: [Public]
 *
 *     responses:
 *       200:
 *         description: home data
 */

// GETs
router.get("/", getHome);

export default router;