import { body } from "express-validator";

export const updateProfileValidator = [
    body("fullname")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Имя должно содержать от 2 до 100 символов"),

    body("email")
        .optional()
        .trim()
        .isEmail().withMessage("Некорректный формат email")
        .normalizeEmail(),

    body("phone")
        .optional()
        .trim()
        .isMobilePhone("kk-KZ").withMessage("Некорректный формат телефона")
];

export const updateEmailValidator = [
    body("email")
        .trim()
        .isEmail().withMessage("Некорректный формат email")
        .normalizeEmail()
];
