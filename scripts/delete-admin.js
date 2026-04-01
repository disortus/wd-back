import mongoose from "mongoose";
import User from "../src/models/User.js";
import { MONGO_URI, ORIGINAL_ADMIN_EMAIL } from "../config/env.js";

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.log("❌ MongoDB connection failed", err.message);
        process.exit(1);
    }
}

async function deleteOriginalAdmin() {
    try {
        const exists = await User.findOne({ email: ORIGINAL_ADMIN_EMAIL });

        if (!exists) {
            console.log("⚠️  Original admin not found");
            process.exit(1);
        }

        const originalAdmin = await User.findByIdAndDelete(exists._id);

        if (!originalAdmin) {
            console.log("⚠️  Original admin not found");
            process.exit(1);
        }

        console.log("✅ Original admin deleted");
        process.exit();
    } catch (err) {
        console.log("❌ Original admin deleting failed", err.message);
        process.exit(1);
    }
}

const startScript = async () => {
    console.log("🚀 Script started");

    await connectDB();
    await deleteOriginalAdmin();
};

startScript();