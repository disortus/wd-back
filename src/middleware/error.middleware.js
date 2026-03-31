import { ERROR_TYPES } from "../utils/enums.js";

export function errorHandler(err, req, res, next) {
    console.error(err);

    if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
        return res.status(400).json({
            message: err.message
        });
    }

    if (err.name === ERROR_TYPES.UNAUTHORIZED_ERROR) {
        return res.status(401).json({
            message: "invalid token"
        });
    }

    res.status(500).json({
        message: "server error"
    })
}
