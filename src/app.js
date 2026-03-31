import express from "express"
import cors from "cors";
import router from "./routers/index.routes.js";

const app = express();

// cors
app.use(cors({
    origin: "*",
    credentials: true
}));

// JSON parser
app.use(express.json());

// All routes
app.use("/api", router);

// home page
app.get("/", (req, res) => {
    res.end("home page");
});

export default app