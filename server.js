import app from "./src/app.js";
import { connectDB } from "./config/db.js";
import { PORT } from "./config/env.js";

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📄 Api documentation available on http://localhost:${PORT}/docs`)
    })
};

startServer();