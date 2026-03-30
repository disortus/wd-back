import { body } from "express-validator";

export const registerValidator = [
    body("fullname")
        .trim()
        .isLength({ min:2 }).withMessage("name must be 2 cgaracters at least"),

    body("email")
        .isEmail().withMessage("invalid email format"),
    
    body("password")
        .isLength({ min: 6 }).withMessage("password must be 6 characters at least"),
    
    body("phone")
        .optional()
        .isMobilePhone("kk-KZ").withMessage("invalid phone number format")
];

export const loginValidator = [
    body("email")
        .isEmail().withMessage("invalid email format"),
    
    body("password")
        .notEmpty()
];