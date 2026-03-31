import { body } from "express-validator";

export const updateProfileValidator = [
    body("fullname")
        .optional()
        .isLength({ min: 2 }).withMessage(" name too short"),

    body("phone")
        .optional()
        .isMobilePhone("kk-KZ")
];

// TODO: add feature validator for new functions