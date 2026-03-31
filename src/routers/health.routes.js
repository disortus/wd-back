import { Router } from "express";

const router = Router();

// Swagger docs
/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Server health
 */


/**
 * @swagger
 * /health:
 *   get:
 *     summary: check server health
 *     tags: [Health]
 *
 *     responses:
 *       200:
 *         description: server is alive
 */

// GETs
router.get("/", (req, res) => {
    res.json({
        ok: true,
        uptime: process.uptime()
    });
});

export default router;