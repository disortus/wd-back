import { CATEGORY_TREE, ATTRIBUTE_DEFINITIONS } from "./enums.js";
import { AppError } from "./app-errors.js";
import { asyncHandler } from "./async-handler.js";

export const ensureSubcategoryBelongsToCategory = asyncHandler(async (categorySlug, subcategorySlug) => {
    const allowed = CATEGORY_TREE[categorySlug];

    if (!allowed) {
        throw new AppError(400, "invalid category");
    }

    if (!allowed.includes(subcategorySlug)) {
        throw new AppError(400, "subcategory does not belong to category");
    }
});

export const validateProductAttributes = asyncHandler(async (subcategorySlug, attributes) => {
    const definition = ATTRIBUTE_DEFINITIONS[subcategorySlug] || [];

    const allowedKeys = definition.map(a => a.key);

    for (const key of Object.keys(attributes || {})) {
        if (!allowedKeys.includes(key)) {
            throw new AppError(400, `invalid attribute: ${key}`);
        }
    }
});
