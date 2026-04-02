import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Category from "../src/models/Category.js";
import Subcategory from "../src/models/Subcategory.js";
import {
    CATEGORY_TREE,
    CATEGORY_NAMES,
    SUBCATEGORY_NAMES,
    ATTRIBUTE_DEFINITIONS
} from "../src/utils/enums.js";

dotenv.config();

const seedCatalog = async () => {
    try {
        await connectDB();
        console.log("📦 Connected to database");

        // Clear existing data
        console.log("🧹 Clearing existing catalog data...");
        await Category.deleteMany({});
        await Subcategory.deleteMany({});
        console.log("✓ Cleared existing categories and subcategories");

        const createdCategories = [];
        const createdSubcategories = [];

        // Create categories
        console.log("\n📂 Creating categories...");
        for (const [slug, name] of Object.entries(CATEGORY_NAMES)) {
            const category = await Category.create({
                slug,
                name,
                image: "",
                isActive: true
            });
            createdCategories.push(category);
            console.log(`  ✓ Created category: ${name} (${slug})`);
        }

        // Create subcategories
        console.log("\n📁 Creating subcategories...");
        for (const [slug, name] of Object.entries(SUBCATEGORY_NAMES)) {
            // Find which category this subcategory belongs to
            let categorySlug = null;
            for (const [catSlug, subcats] of Object.entries(CATEGORY_TREE)) {
                if (subcats.includes(slug)) {
                    categorySlug = catSlug;
                    break;
                }
            }

            if (categorySlug) {
                const subcategory = await Subcategory.create({
                    slug,
                    name,
                    categorySlug,
                    isActive: true
                });
                createdSubcategories.push(subcategory);
                console.log(`  ✓ Created subcategory: ${name} (${slug}) under ${categorySlug}`);
            }
        }

        // Print attribute definitions summary
        console.log("\n📋 Attribute Definitions Summary:");
        console.log("=".repeat(50));
        let totalAttributes = 0;
        for (const [subcatSlug, attributes] of Object.entries(ATTRIBUTE_DEFINITIONS)) {
            const subcatName = SUBCATEGORY_NAMES[subcatSlug] || subcatSlug;
            console.log(`\n${subcatName}:`);
            attributes.forEach(attr => {
                const unitStr = attr.unit ? ` (${attr.unit})` : "";
                console.log(`  - ${attr.label}: ${attr.type}${unitStr}`);
                totalAttributes++;
            });
        }

        console.log("\n" + "=".repeat(50));
        console.log("\n✅ Catalog seeding completed successfully!");
        console.log(`   Categories created: ${createdCategories.length}`);
        console.log(`   Subcategories created: ${createdSubcategories.length}`);
        console.log(`   Total attributes defined: ${totalAttributes}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding catalog:", error);
        process.exit(1);
    }
};

seedCatalog();
