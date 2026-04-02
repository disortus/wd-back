import Category from "../../models/Category.js";
import Subcategory from "../../models/Subcategory.js";
import { ATTRIBUTE_DEFINITIONS } from "../../utils/enums.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { AppError } from "../../utils/app-errors.js";

export const getCatalogTree = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true });

    const subcategories = await Subcategory.find({ isActive: true });

    if (!categories || !subcategories) {
        throw new AppError(404, "categories not found");
    }

    const result = {};

    for (const cat of categories) {
        result[cat.slug] = {
            name: cat.name,
            subcategories: {}
        };
    }

    for (const sub of subcategories) {
        result[sub.categorySlug].subcategories[sub.slug] = {
            name: sub.name,
            attribures: ATTRIBUTE_DEFINITIONS[sub.slug] || []
        };
    }

    res.json({
        ok: true,
        data: result
    });
});