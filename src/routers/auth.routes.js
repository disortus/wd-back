import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { validate } from "../middleware/validation.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { authRateLimit } from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post("/register", authRateLimit, registerValidator, validate, register);

router.post("/login", authRateLimit, loginValidator, validate, login);

router.get("/me", requireAuth, getMe);

export default router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: register new user
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *
 *     responses:
 *
 *       201:
 *         description: success
 *
 *         content:
 *           application/json:
 *
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *
 *       400:
 *         description: validation error
 *
 *         content:
 *           application/json:
 *
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
