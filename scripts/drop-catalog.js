import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Category from "../src/models/Category.js";
import Subcategory from "../src/models/Subcategory.js";
import Product from "../src/models/Product.js";

dotenv.config();

const dropCatalog = async () => {
    try {
        await connectDB();
        console.log("📦 Connected to database");

        console.log("\n🗑️  Dropping catalog data...\n");

        // Drop products first (due to potential references)
        const productsDeleted = await Product.deleteMany({});
        console.log(`  ✓ Deleted ${productsDeleted.deletedCount} products`);

        // Drop subcategories
        const subcategoriesDeleted = await Subcategory.deleteMany({});
        console.log(`  ✓ Deleted ${subcategoriesDeleted.deletedCount} subcategories`);

        // Drop categories
        const categoriesDeleted = await Category.deleteMany({});
        console.log(`  ✓ Deleted ${categoriesDeleted.deletedCount} categories`);

        console.log("\n✅ Catalog dropped successfully!");
        console.log(`   Products deleted: ${productsDeleted.deletedCount}`);
        console.log(`   Subcategories deleted: ${subcategoriesDeleted.deletedCount}`);
        console.log(`   Categories deleted: ${categoriesDeleted.deletedCount}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error dropping catalog:", error);
        process.exit(1);
    }
};

dropCatalog();
