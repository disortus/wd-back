import { validationResult } from "express-validator";

export function validate(req, res, next) {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        ok: false,
        message: "validation failed",
        details: "invalid data format",
        errors: errors.array().map((error) => ({
            field: error.path,
            message: error.msg
        }))
    });
}