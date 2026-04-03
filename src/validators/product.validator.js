import { body, param, query} from "express-validator";
import { CATEGORY_TYPES_LIST, SUBCATEGORY_TYPES_LIST } from "../utils/enums.js";

export const createProductValidator = [
    body("title")
        .isLength({ min: 3 }).withMessage(" title too short"),

    body("categorySlug")
        .isIn(CATEGORY_TYPES_LIST).withMessage("invalid category type"),

    body("subcategorySlug")
        .isIn(SUBCATEGORY_TYPES_LIST).withMessage("invalid subcategory type"),
    
    body("price")
        .isFloat({ min: 0 }).withMessage("price can't be less than 0"),
    
    body("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("stock can't be less than 0"),
    
    body("attributes")
        .optional()
        .isObject(),
    
    body("category_id")
        .optional()
        .isMongoId().withMessage("invalid id format"),
    
    body("description")
        .optional(),
    
    body("image")
        .optional()
        .isArray()
];

export const updateProductValidator = [
    param("id")
        .isMongoId().withMessage("invalid id format"),

    body("title")
        .optional()
        .isLength({ min: 3 }).withMessage("title too short"),
    
    body("price")
        .optional()
        .isFloat({ min: 0 }).withMessage("price can't be less than 0"),

    body("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("stock can't be less than 0")
];

export const queryProductsValidator = [
    query("category_id")
        .optional()
        .isMongoId().withMessage("invalid id format"),
    
    query("minPrice")
        .optional()
        .isFloat(),
    
    query("maxPrice")
        .optional()
        .isFloat(),
    
    query("page")
        .optional()
        .isInt(),
    
    query("limit")
        .optional()
        .isInt()
];

export const stockValidator = [
    body("quantity")
        .isInt({ min: 1 }).withMessage("quantity must be a positive integer")
];

export const idParamValidator = [
    param("id")
        .isMongoId().withMessage("invalid id format")
];
