import { body } from "express-validator";

export const registerValidator = [
    body("fullname")
        .trim()
        .isLength({ min:2 }).withMessage("name must be 2 cgaracters at least"),

    body("phone")
        .trim()
        .isMobilePhone("kk-KZ").withMessage("invalid phone number format"),
    
    body("password")
        .isLength({ min: 6 }).withMessage("password must be 6 characters at least"),

    body("confirmPassword")
        .notEmpty().withMessage("confirm password is required")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("passwords do not match")
];

export const loginValidator = [
    body("phone")
        .trim()
        .isMobilePhone("kk-KZ").withMessage("invalid phone number format"),
    
    body("password")
        .notEmpty()
];
