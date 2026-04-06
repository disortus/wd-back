import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import router from "./routers/index.routes.js";
import { swaggerSpec } from "../docs/swagger.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { globalRateLimit } from "./middleware/rate-limit.middleware.js";
import { requestLogger } from "./middleware/logging.middleware.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Create log streams
const accessLogStream = fs.createWriteStream(
    path.join(logsDir, "access.log"),
    { flags: "a" }
);

const errorLogStream = fs.createWriteStream(
    path.join(logsDir, "error.log"),
    { flags: "a" }
);

const app = express();

// Cookie parser
app.use(cookieParser());

// CORS
app.use(cors({
    origin: ["http://localhost:5173", "https://wd-front-41qu.vercel.app", "https://wd-front.vercel.app"],
    credentials: true
}));

// JSON parser
app.use(express.json());

// Security
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

app.use(globalRateLimit);

// HTTP requests logger (combined format to file)
// app.use(morgan("combined", { stream: accessLogStream }));

// Also log to console in development
app.use(morgan("dev"));

// Request logging to database
app.use(requestLogger);

// Response compression
app.use(compression());

// All routes
app.use("/api", router);

// Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handlers
app.use(notFound);
app.use(errorHandler);

// Home page
app.get("/", (req, res) => {
    res.end("home page 🏡");
});

// Export for testing
export default app;

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: create category
 *     tags: [Categories]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       201:
 *         description: category created
 */