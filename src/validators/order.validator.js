import { body, param } from "express-validator";

export const createOrderValidator = [
    body("deliveryAddress")
        .isObject().withMessage("Delivery address must be an object"),

    body("deliveryAddress.street")
        .notEmpty().withMessage("Street is required"),

    body("deliveryAddress.city")
        .notEmpty().withMessage("City is required"),

    body("deliveryAddress.postalCode")
        .notEmpty().withMessage("Postal code is required"),

    body("deliveryAddress.country")
        .notEmpty().withMessage("Country is required"),

    body("recipientName")
        .notEmpty().withMessage("Recipient name is required"),

    body("recipientPhone")
        .notEmpty().withMessage("Recipient phone is required")
];

export const orderIdParamValidator = [
    param("id")
        .isMongoId().withMessage("Invalid order ID format")
];

export const cancelOrderValidator = [
    param("id")
        .isMongoId().withMessage("Invalid order ID format"),

    body("reason")
        .optional()
        .isString()
];