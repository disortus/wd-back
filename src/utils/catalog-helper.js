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
    // attributes can be either an array of objects or an object
    // If it's an array, validate each attribute's key
    // If it's an object, validate each key in the object
    
    const definition = ATTRIBUTE_DEFINITIONS[subcategorySlug] || [];
    const allowedKeys = definition.map(a => a.key);

    if (Array.isArray(attributes)) {
        // Validate array of attribute objects
        for (const attr of attributes) {
            if (attr.key && !allowedKeys.includes(attr.key)) {
                throw new AppError(400, `invalid attribute: ${attr.key}`);
            }
        }
    } else if (attributes && typeof attributes === 'object') {
        // Validate object format (key-value pairs)
        for (const key of Object.keys(attributes)) {
            if (!allowedKeys.includes(key)) {
                throw new AppError(400, `invalid attribute: ${key}`);
            }
        }
    }
});
