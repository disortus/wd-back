import Category from "../../models/Category.js";
import Subcategory from "../../models/Subcategory.js";
import { CATEGORY_TREE, CATEGORY_TYPES, SUBCATEGORY_TYPES, CATEGORY_NAMES, SUBCATEGORY_NAMES } from "../../utils/enums.js";
import { AppError } from "../../utils/app-errors.js";
import { asyncHandler } from "../../utils/async-handler.js";

// Seed catalog from enums
export const seedCatalog = asyncHandler(async (req, res) => {
    const createdCategories = [];
    const createdSubcategories = [];

    // Create categories
    for (const [slug, name] of Object.entries(CATEGORY_NAMES)) {
        let category = await Category.findOne({ slug });
        
        if (!category) {
            category = await Category.create({
                slug,
                name,
                image: ""
            });
            createdCategories.push(category);
        }
    }

    // Create subcategories
    for (const [slug, name] of Object.entries(SUBCATEGORY_NAMES)) {
        let subcategory = await Subcategory.findOne({ slug });
        
        if (!subcategory) {
            // Find which category this subcategory belongs to
            let categorySlug = null;
            for (const [catSlug, subcats] of Object.entries(CATEGORY_TREE)) {
                if (subcats.includes(slug)) {
                    categorySlug = catSlug;
                    break;
                }
            }

            if (categorySlug) {
                subcategory = await Subcategory.create({
                    slug,
                    name,
                    categorySlug,
                    isActive: true
                });
                createdSubcategories.push(subcategory);
            }
        }
    }

    res.json({
        success: true,
        message: "Catalog seeded successfully",
        data: {
            categoriesCreated: createdCategories.length,
            subcategoriesCreated: createdSubcategories.length
        }
    });
});

// Get all categories with their subcategories
export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find()
        .sort({ name: 1 });

    const categoriesWithSubcategories = await Promise.all(
        categories.map(async (category) => {
            const subcategories = await Subcategory.find({ 
                categorySlug: category.slug 
            }).sort({ name: 1 });

            return {
                ...category.toObject(),
                subcategories
            };
        })
    );

    res.json({
        success: true,
        data: categoriesWithSubcategories
    });
});

// Toggle category active status
export const toggleCategoryActive = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        throw new AppError(404, "Category not found");
    }

    // Update all subcategories' active status
    await Subcategory.updateMany(
        { categorySlug: category.slug },
        { isActive: !category.isActive }
    );

    category.isActive = !category.isActive;
    await category.save();

    res.json({
        success: true,
        data: category
    });
});

// Toggle subcategory active status
export const toggleSubcategoryActive = asyncHandler(async (req, res) => {
    const subcategory = await Subcategory.findById(req.params.id);

    if (!subcategory) {
        throw new AppError(404, "Subcategory not found");
    }

    // Check if parent category is active
    const category = await Category.findOne({ slug: subcategory.categorySlug });
    if (category && !category.isActive) {
        throw new AppError(400, "Cannot activate subcategory while parent category is inactive");
    }

    subcategory.isActive = !subcategory.isActive;
    await subcategory.save();

    res.json({
        success: true,
        data: subcategory
    });
});

// Get catalog structure from enums
export const getCatalogStructure = asyncHandler(async (req, res) => {
    const structure = {
        categories: [],
        subcategories: {},
        attributes: {}
    };

    // Build categories list
    for (const [slug, name] of Object.entries(CATEGORY_NAMES)) {
        structure.categories.push({
            slug,
            name,
            subcategories: CATEGORY_TREE[slug] || []
        });
    }

    // Build subcategories with attributes
    for (const [slug, name] of Object.entries(SUBCATEGORY_NAMES)) {
        structure.subcategories[slug] = {
            name,
            categorySlug: Object.keys(CATEGORY_TREE).find(cat => 
                CATEGORY_TREE[cat].includes(slug)
            )
        };
    }

    // Import ATTRIBUTE_DEFINITIONS at runtime
    const { ATTRIBUTE_DEFINITIONS } = await import("../../utils/enums.js");
    structure.attributes = ATTRIBUTE_DEFINITIONS;

    res.json({
        success: true,
        data: structure
    });
});
