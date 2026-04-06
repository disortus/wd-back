import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import { USER_ROLE_TYPES } from "../src/utils/enums.js";
import { 
    MONGO_URI,
    ORIGINAL_MODERATOR_FULLNAME, ORIGINAL_MODERATOR_PHONE, ORIGINAL_MODERATOR_PASSWORD,
    ORIGINAL_COURIER_FULLNAME, ORIGINAL_COURIER_PHONE, ORIGINAL_COURIER_PASSWORD,
    ORIGINAL_SUPPORT_FULLNAME, ORIGINAL_SUPPORT_PHONE, ORIGINAL_SUPPORT_PASSWORD,
    ORIGINAL_DEVELOPER_FULLNAME, ORIGINAL_DEVELOPER_PHONE, ORIGINAL_DEVELOPER_PASSWORD
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

async function createStaffUser(fullname, phone, password, role) {
    try {
        const exists = await User.findOne({ phone });

        if (exists) {
            console.log(`⚠️ ${role} (${phone}) already exists`);
            return false;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await User.create({
            fullname,
            phone,
            passwordHash,
            role,
            staffInfo: {
                hireDate: new Date()
            }
        });

        console.log(`✅ ${role} created: ${fullname} (${phone})`);
        return true;
    } catch (err) {
        console.log(`❌ Failed to create ${role}:`, err.message);
        return false;
    }
}

async function createAllStaff() {
    console.log("\n📦 Creating default staff users...\n");
    
    // Create Moderator
    await createStaffUser(
        ORIGINAL_MODERATOR_FULLNAME,
        ORIGINAL_MODERATOR_PHONE,
        ORIGINAL_MODERATOR_PASSWORD,
        USER_ROLE_TYPES.MODERATOR
    );

    // Create Courier
    await createStaffUser(
        ORIGINAL_COURIER_FULLNAME,
        ORIGINAL_COURIER_PHONE,
        ORIGINAL_COURIER_PASSWORD,
        USER_ROLE_TYPES.COURIER
    );

    // Create Support
    await createStaffUser(
        ORIGINAL_SUPPORT_FULLNAME,
        ORIGINAL_SUPPORT_PHONE,
        ORIGINAL_SUPPORT_PASSWORD,
        USER_ROLE_TYPES.SUPPORT
    );

    // Create Developer
    await createStaffUser(
        ORIGINAL_DEVELOPER_FULLNAME,
        ORIGINAL_DEVELOPER_PHONE,
        ORIGINAL_DEVELOPER_PASSWORD,
        USER_ROLE_TYPES.DEVELOPER
    );

    console.log("\n✅ All staff users created!");
    process.exit();
}

const startScript = async () => {
    console.log("🚀 Staff creation script started");

    await connectDB();
    await createAllStaff();
};

startScript();