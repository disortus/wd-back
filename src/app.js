import express from "express"
import cors from "cors";

const app = express();

// cors
app.use(cors({
    origin: "*",
    credentials: true
}));

// JSON parser
app.use(express.json());

// home page
app.get("/", (req, res) => {
    res.end("home page");
});

export default app