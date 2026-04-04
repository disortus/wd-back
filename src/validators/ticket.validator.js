import { body, param } from "express-validator";

export const createTicketValidator = [
    body("subject")
        .notEmpty().withMessage("Subject is required")
        .isLength({ min: 3, max: 200 }).withMessage("Subject must be between 3 and 200 characters"),

    body("description")
        .notEmpty().withMessage("Description is required")
        .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

    body("category")
        .optional()
        .isIn(["order", "product", "delivery", "payment", "account", "technical", "other"])
        .withMessage("Invalid category"),

    body("priority")
        .optional()
        .isIn(["low", "medium", "high", "urgent"])
        .withMessage("Invalid priority"),

    body("relatedOrderId")
        .optional()
        .isMongoId().withMessage("Invalid order ID format")
];

export const ticketIdParamValidator = [
    param("id")
        .isMongoId().withMessage("Invalid ticket ID format")
];

export const addTicketMessageValidator = [
    param("id")
        .isMongoId().withMessage("Invalid ticket ID format"),

    body("message")
        .notEmpty().withMessage("Message is required")
        .isLength({ min: 1 }).withMessage("Message cannot be empty"),

    body("attachments")
        .optional()
        .isArray()
];

export const rateTicketValidator = [
    param("id")
        .isMongoId().withMessage("Invalid ticket ID format"),

    body("rating")
        .isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),

    body("feedback")
        .optional()
        .isString()
];

// Support-side validators
export const supportTicketIdParamValidator = [
    param("id")
        .isMongoId().withMessage("Invalid ticket ID format")
];

export const supportAddMessageValidator = [
    param("id")
        .isMongoId().withMessage("Invalid ticket ID format"),

    body("message")
        .notEmpty().withMessage("Message is required")
        .isLength({ min: 1 }).withMessage("Message cannot be empty"),

    body("attachments")
        .optional()
        .isArray().withMessage("Attachments must be an array")
];

export const supportResolveCloseValidator = [
    param("id")
        .isMongoId().withMessage("Invalid ticket ID format"),

    body("message")
        .optional()
        .isString().withMessage("Message must be a string")
];

export const supportReopenValidator = [
    param("id")
        .isMongoId().withMessage("Invalid ticket ID format"),

    body("reason")
        .optional()
        .isString().withMessage("Reason must be a string")
];

export const supportRejectTicketValidator = [
    param("id")
        .isMongoId().withMessage("Invalid ticket ID format"),

    body("reason")
        .optional()
        .isString().withMessage("Reason must be a string")
];