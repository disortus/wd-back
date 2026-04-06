import { validationResult } from "express-validator";

// Middleware factory that creates a validation middleware
export function createValidator(validatorArray) {
    return async function validate(req, res, next) {
        try {
            // Run all validators in the chain
            await Promise.all(
                validatorArray.map(validator => validator.run(req))
            );
            
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
        } catch (err) {
            next(err);
        }
    };
}

// Legacy export for backward compatibility
// This is used when no validators are needed but we still need to call next()
export const validate = async (req, res, next) => {
    next();
};
