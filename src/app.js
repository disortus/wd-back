import express from "express";
import helmet from "helmet";
import cors from "cors";
import router from "./routers/index.routes.js";
import morgan from "morgan";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/swagger.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import { globalRateLimit } from "./middleware/rate-limit.middleware.js";

const app = express();

// CORS
app.use(cors({
    origin: "*",
    credentials: true
}));

// JSON parser
app.use(express.json());

// Security
app.use(helmet());
app.use(globalRateLimit);

// HTTP requests logger
app.use(morgan("dev"));

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

export default app