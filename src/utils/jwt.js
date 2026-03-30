import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRE } from "../../config/env.js";

export function generateAccessToken(user) {
    return jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: JWT_EXPIRE
            }
    );
}