import { body, param } from "express-validator";

export const createCategoryValidator = [
    body("name")
        .trim()
        .isLength({ min: 2}).withMessage("name too short"),
    body("slug")
        .optional()
        .isSlug().withMessage("invalid slug")
];

export const updateCategoryValidator = [
    param("id")
        .isMongoId().withMessage("invalid id format"),
    body("name")
        .optional()
        .isLength({ min: 2 }).withMessage("name too short"),
    body("slug")
        .optional()
        .isSlug().withMessage("invalid slug")
];

export const idParamValidator = [
    param("id")
        .isMongoId().withMessage("invalid id format")
];