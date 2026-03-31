import express from "express"
import cors from "cors";
import router from "./routers/index.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/swagger.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";

const app = express();

// CORS
app.use(cors({
    origin: "*",
    credentials: true
}));

// JSON parser
app.use(express.json());

// All routes
app.use("/api", router);

// Global error handlers
app.use(errorHandler);
app.use(notFound);

// Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Home page
app.get("/", (req, res) => {
    res.end("home page 🏡");
});

export default app