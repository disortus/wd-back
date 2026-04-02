import mongoose from "mongoose";
import { ERROR_TYPES } from "../utils/enums.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Error log stream
const errorLogStream = fs.createWriteStream(
    path.join(logsDir, "error.log"),
    { flags: "a" }
);

function logError(err) {
    const timestamp = new Date().toISOString();
    const errorLog = `[${timestamp}] ${err.stack || err}\n`;
    errorLogStream.write(errorLog);
}

export function notFound(req, res) {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
}

export function errorHandler(err, req, res, next) {
    // Log the error
    console.error(err);
    logError(err);

    if (err.name === ERROR_TYPES.VALIDATION_ERROR) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    if (err.name === ERROR_TYPES.UNAUTHORIZED_ERROR) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }

    if (err.name === ERROR_TYPES.CAST_ERROR || err instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID"
        });
    }

    if (err.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Duplicate value",
            details: err.keyValue
        });
    }

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            details: err.details || null
        });
    }

    res.status(500).json({
        success: false,
        message: "Server error"
    });
}