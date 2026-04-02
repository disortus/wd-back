import { expressjwt } from "express-jwt";
import { JWT_SECRET } from "../../config/env.js";

export const requireAuth = expressjwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "auth",
    getToken: (req) => {
        return req.cookies.token
    }
});