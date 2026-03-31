import mongoose from "mongoose";
import { ERROR_TYPES } from "../utils/enums.js";

export function errorHandler(err, req, res, next) {
    console.error(err);

    if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
        return res.status(400).json({
            ok: false,
            message: err.message
        });
    }

    if (err.name === ERROR_TYPES.UNAUTHORIZED_ERROR) {
        return res.status(401).json({
            ok: false,
            message: "invalid token"
        });
    }

    if (err.name === ERROR_TYPES.CAST_ERROR || err instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            ok: false,
            message: "invalid id"
        });
    }

    if (err.isOpertional) {
        return res.status(err.statusCode).json({
            ok: false,
            message: err.message,
            details: err.details || null
        });
    }

    res.status(500).json({
        ok: false,
        message: "server error"
    });
}
