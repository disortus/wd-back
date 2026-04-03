import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import { USER_ROLE_TYPES } from "../src/utils/enums.js";
import { MONGO_URI, 
    ORIGINAL_ADMIN_FULLNAME, ORIGINAL_ADMIN_PHONE, ORIGINAL_ADMIN_PASSWORD
 } from "../config/env.js";

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.log("❌ MongoDB connection failed", err.message);
        process.exit(1);
    }
}

async function cretaeOriginalAdmin() {
    try {
        const exists = await User.findOne({ phone: ORIGINAL_ADMIN_PHONE });

        if (exists) {
            console.log("⚠️ Original admin already exists");
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        const originalAdminPasswordHash = await bcrypt.hash(ORIGINAL_ADMIN_PASSWORD, salt);

        // Original Admin
        await User.create({
            fullname: ORIGINAL_ADMIN_FULLNAME,
            phone: ORIGINAL_ADMIN_PHONE,
            passwordHash: originalAdminPasswordHash,
            role: USER_ROLE_TYPES.ADMIN
        });

        console.log("✅ Original admin created");
        process.exit();
    } catch (err) {
        console.log("❌ Original admin creating failed", err.message);
        process.exit(1);
    }
}

const startScript= async () => {
    console.log("🚀 Script started");

    await connectDB();
    await cretaeOriginalAdmin();
};

startScript();