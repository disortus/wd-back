import { Router } from "express";
import { getMe, updateMe } from "../../controllers/profile.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { updateProfileValidator } from "../../validators/profile.validator.js";

const router = Router();

// Swagger docs
/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile
 */


/**
 * @swagger
 * /profile/me:
 *   get:
 *     summary: get current user
 *     tags: [Profile]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: user profile
 */


/**
 * @swagger
 * /profile/me:
 *   patch:
 *     summary: update current user
 *     tags: [Profile]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: profile updated
 */

// GETs
router.get("/me", requireAuth, getMe);

// PATCHs
router.patch("/me", requireAuth, updateProfileValidator, validate, updateMe);

// TODO: add more routes for feature functions

export default router;