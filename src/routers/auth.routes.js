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
