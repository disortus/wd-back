import { USER_ROLE_TYPES } from "../utils/enums.js";
import { AppError } from "../utils/app-errors.js";

export function allowRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.auth || !req.auth.role) {
            return res.status(401).json({
                ok: false,
                message: "Authentication required"
            });
        }

        // Admin has access to everything
        if (req.auth.role === USER_ROLE_TYPES.ADMIN) {
            return next();
        }

        if (!allowedRoles.includes(req.auth.role)) {
            return res.status(403).json({
                ok: false,
                message: "Forbidden - insufficient permissions"
            });
        }

        next();
    };
}

// Permission check middleware
export function checkPermission(...permissions) {
    return (req, res, next) => {
        if (!req.auth || !req.auth.role) {
            return res.status(401).json({
                ok: false,
                message: "Authentication required"
            });
        }

        // Admin has all permissions
        if (req.auth.role === USER_ROLE_TYPES.ADMIN) {
            return next();
        }

        // Get role permissions from enums
        const { ROLE_PERMISSIONS } = require("../utils/enums.js");
        const userPermissions = ROLE_PERMISSIONS[req.auth.role] || [];

        const hasPermission = permissions.every(p => userPermissions.includes(p));

        if (!hasPermission) {
            return res.status(403).json({
                ok: false,
                message: "Forbidden - insufficient permissions"
            });
        }

        next();
    };
}