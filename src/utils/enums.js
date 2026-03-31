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
    INTERNAL_SERVER_ERROR: "InternalServerError"
};

export const ERROR_TYPES_LIST = Object.values(ERROR_TYPES);