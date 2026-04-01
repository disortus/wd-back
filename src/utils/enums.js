// User roles
export const USER_ROLE_TYPES = {
    USER: "user",
    ADMIN: "admin",
    COURIER: "courier"
};

export const USER_ROLE_TYPES_LIST = Object.values(USER_ROLE_TYPES);

// DB Models
export const DB_MODELS = {
    USER: "User",
    CATEGORY: "Category",
    SUBCATEGORY: "Subcategory",
    PRODUCT: "Product",
    CART_ITEM: "CartItem",
    ORDER: "Order"
};

export const DB_MODELS_LIST = Object.values(DB_MODELS);

// Order status
export const ORDER_STATUS_TYPES = {
    NEW: "new",
    CONFIRMED: "confirmed",
    PACKING: "packing",
    READY_FOR_DELIVERY: "ready_for_delivery",
    ASSIGNED: "assigned",
    DELIVERING: "delivering",
    DELIVERED: "delivered",
    CANCELED: "canceled"
};

export const ORDER_STATUS_TYPES_LIST = Object.values(ORDER_STATUS_TYPES);

// Errors types enum
export const ERROR_TYPES = {
    VALIDATION_ERROR: "ValidationError",
    UNAUTHORIZED_ERROR: "UnauthorizedError",
    NOT_FOUND_ERROR: "NotFoundError",
    CAST_ERROR: "CastError",
    APP_ERROR: "AppError",
    INTERNAL_SERVER_ERROR: "InternalServerError"
};

export const ERROR_TYPES_LIST = Object.values(ERROR_TYPES);

// Category types
export const CATEGORY_TYPES = {
    ELECTRONICS: "electronics",
    ACCESSORIES: "accessories"
};

export const CATEGORY_TYPES_LIST = Object.values(CATEGORY_TYPES);

// SubCategory types
export const SUBCATEGORY_TYPES = {
    SMARTPHONES: "smartphones",
    LAPTOPS: "laptops",
    TABLETS: "tablets",
    WATCHES: "watches",
    HEADPHONES: "headphones",
    CHARGERS: "chargers",
    CABLES: "cables",
    CASES: "cases"
};

export const SUBCATEGORY_TYPES_LIST = Object.values(SUBCATEGORY_TYPES);

// Category tree
export const CATEGORY_TREE = {
    [CATEGORY_TYPES.ELECTRONICS]: [
        SUBCATEGORY_TYPES.SMARTPHONES,
        SUBCATEGORY_TYPES.LAPTOPS,
        SUBCATEGORY_TYPES.TABLETS,
        SUBCATEGORY_TYPES.WATCHES,
        SUBCATEGORY_TYPES.HEADPHONES
    ],
    [CATEGORY_TYPES.ACCESSORIES]: [
        SUBCATEGORY_TYPES.CABLES,
        SUBCATEGORY_TYPES.CASES,
        SUBCATEGORY_TYPES.CHARGERS
    ]
};

export const CATEGORY_TREE_LIST = Object.values(CATEGORY_TREE);

// Attribute definition
export const ATTRIBUTE_DEFINITIONS = {
    [SUBCATEGORY_TYPES.SMARTPHONES]: [
        { key: "display", label: "Display", type: "string" },
        { key: "battery", label: "Battery capacity", type: "number", unit: "mAh" },
        { key: "storage", label: "Storage", type: "number", unit: "GB" },
        { key: "ram", label: "RAM", type: "number", unit: "GB" }
    ],

    [SUBCATEGORY_TYPES.LAPTOPS]: [
        { key: "cpu", label: "CPU", type: "string" },
        { key: "ram", label: "RAM", type: "number", unit: "GB" },
        { key: "storage", label: "Storage", type: "number", unit: "GB" },
        { key: "display", label: "Display size", type: "number", unit: "inch" }
    ],

    [SUBCATEGORY_TYPES.HEADPHONES]: [
        { key: "type", label: "Type", type: "string" },
        { key: "noise_canceling", label: "Noise canceling", type: "boolean" }
    ],

    [SUBCATEGORY_TYPES.CABLES]: [
        { key: "length", label: "Length", type: "number", unit: "m" }
    ],

    [SUBCATEGORY_TYPES.CHARGERS]: [
        { key: "power", label: "Power", type: "number", unit: "W" }
    ]
};