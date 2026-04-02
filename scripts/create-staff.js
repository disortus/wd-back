import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../src/models/User.js";
import { USER_ROLE_TYPES } from "../src/utils/enums.js";

dotenv.config();

const createStaff = async () => {
    try {
        await connectDB();
        console.log("📦 Connected to database");

        const args = process.argv.slice(2);
        
        if (args.length < 4) {
            console.log("\n❌ Usage: node create-staff.js <email> <password> <role> <fullname>");
            console.log("\nAvailable roles:");
            console.log("  - moderator");
            console.log("  - courier");
            console.log("  - support");
            console.log("  - admin");
            console.log("\nExample:");
            console.log("  node create-staff.js admin@example.com password123 admin \"Admin User\"");
            process.exit(1);
        }

        const [email, password, role, fullname] = args;

        // Validate role
        const validRoles = Object.values(USER_ROLE_TYPES);
        if (!validRoles.includes(role)) {
            console.log(`\n❌ Invalid role: ${role}`);
            console.log("Valid roles:", validRoles.join(", "));
            process.exit(1);
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`\n❌ User with email ${email} already exists`);
            process.exit(1);
        }

        // Create user
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            fullname,
            email,
            passwordHash,
            phone: "",
            role,
            staffInfo: {
                hireDate: new Date()
            }
        });

        console.log(`\n✅ Staff user created successfully!`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Fullname: ${user.fullname}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating staff:", error);
        process.exit(1);
    }
};

createStaff();
