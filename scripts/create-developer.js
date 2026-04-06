import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import { MONGO_URI } from "../config/env.js";

async function createDeveloper() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected");

        const phone = "+77000000005";
        const password = "developer1234";
        const fullname = "developer";

        const exists = await User.findOne({ phone });

        if (exists) {
            console.log(`⚠️ Developer (${phone}) already exists`);
            await mongoose.disconnect();
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await User.create({
            fullname,
            phone,
            passwordHash,
            role: "developer",
            staffInfo: {
                hireDate: new Date()
            }
        });

        console.log(`✅ Developer created: ${fullname} (${phone})`);
        
        await mongoose.disconnect();
        process.exit();
    } catch (err) {
        console.log(`❌ Failed to create developer:`, err.message);
        console.log(`Stack trace:`, err.stack);
        process.exit(1);
    }
}

createDeveloper();
