import { body, param, query} from "express-validator";

export const createProductValidator = [
    body("title")
        .isLength({ min: 3 }).withMessage(" title too short"),
    
    body("price")
        .isFloat({ min: 0 }).withMessage("price can't be less than 0"),
    
    body("stock")
        .optional()
        .isInt({ min: 0 }).withMessage("stock can't be less than 0"),
    
    body("category_id")
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

export const idParamValidator = [
    param("id")
        .isMongoId().withMessage("invalid id format")
];