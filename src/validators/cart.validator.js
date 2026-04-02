import { body, param } from "express-validator";

export const addToCartValidator = [
    body("productId")
        .isMongoId().withMessage("Invalid product ID format"),

    body("quantity")
        .optional()
        .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),

    body("attributes")
        .optional()
        .isArray()
];

export const updateCartItemValidator = [
    param("productId")
        .isMongoId().withMessage("Invalid product ID format"),

    body("quantity")
        .isInt({ min: 1 }).withMessage("Quantity must be at least 1")
];

export const removeFromCartValidator = [
    param("productId")
        .isMongoId().withMessage("Invalid product ID format")
];