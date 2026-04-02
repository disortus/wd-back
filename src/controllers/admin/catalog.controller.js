import Category from "../../models/Category.js";
import Subcategory from "../../models/Subcategory.js";
import { AppError } from "../../utils/app-errors.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const getCatalogAdmin = asyncHandler(async (req, res) => {
    const categories = await Category.find();

    const subcategories = await Subcategory.find();

    if (!categories || !subcategories) {
        throw new AppError(404, "categories not found");
    }

    res.json({
        ok: true,
        data: {
            categories,
            subcategories
        }
    });
});

export const toggleCategory = asyncHandler(async (req, res) => {
    const category = await Category.findOne({ slug: req.param.slug});

    if (!category) {
        throw new AppError(404, "category not found");
    }

    category.isActive = !category.isActive;

    await category.save();

    await Subcategory.updateMany({ categorySlug: category.slug }, { isActive: category.isActive });

    res.json({
        ok: true,
        data: category
    });
});

export const toggleSubcategory = asyncHandler(async (req, res) => {
    const subcategory = await Subcategory.findOne({ slug: req.param.slug });

    if (!subcategory) {
        throw new AppError(404, "subcategory not found");
    }

    subcategory.isActive = !subcategory.isActive;

    await subcategory.save();

    res.json({
        ok: true,
        data: subcategory
    });
});