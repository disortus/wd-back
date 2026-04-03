import { body, param } from "express-validator";
import { USER_ROLE_TYPES_LIST } from "../utils/enums.js";

export const createUserValidator = [
    body("fullname")
        .isLength({ min: 2 }).withMessage("name too short"),
    
    body("phone")
        .isMobilePhone("kk-KZ").withMessage("invalid phone number format"),
    
    body("role")
        .isIn(USER_ROLE_TYPES_LIST).withMessage("invalid role type"),
    
    body("password")
        .isLength({ min: 6 }).withMessage("password must be 6 characters at least")
];

export const updateUserValidator = [
    param("id")
        .isMongoId().withMessage("invalid id format"),
    
    body("fullname")
        .optional()
        .isLength({ min: 2}).withMessage("name too short"),
    
    body("phone")
        .optional()
        .isMobilePhone("kk-KZ").withMessage("invalid phone number format"),
    
    body("role")
        .optional()
        .isIn(USER_ROLE_TYPES_LIST).withMessage("invalid role type")
];

export const idParamValidator = [
    param("id")
        .isMongoId().withMessage("invalid id format")
];