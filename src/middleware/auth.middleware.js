import { expressjwt } from "express-jwt";
import { JWT_SECRET } from "../../config/env.js";

export const requireAuth = expressjwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "auth",
    getToken: (req) => {
        // First try to get token from cookie
        if (req.cookies.token) {
            return req.cookies.token;
        }
        // Then try to get from Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
});
