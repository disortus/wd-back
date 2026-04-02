// =============================================================================
// USER ROLES
// =============================================================================

export const USER_ROLE_TYPES = {
    USER: "user",
    ADMIN: "admin",
    MODERATOR: "moderator",
    COURIER: "courier",
    SUPPORT: "support",
    DEVELOPER: "developer"
};

export const USER_ROLE_TYPES_LIST = Object.values(USER_ROLE_TYPES);

// =============================================================================
// DB MODELS
// =============================================================================

export const DB_MODELS = {
    USER: "User",
    CATEGORY: "Category",
    SUBCATEGORY: "Subcategory",
    PRODUCT: "Product",
    CART_ITEM: "CartItem",
    CART: "Cart",
    ORDER: "Order",
    SUPPORT_TICKET: "SupportTicket"
};

export const DB_MODELS_LIST = Object.values(DB_MODELS);

// =============================================================================
// ORDER STATUS TYPES
// =============================================================================

export const ORDER_STATUS_TYPES = {
    CREATED: "created",
    ACCEPTED_BY_MODERATOR: "accepted_by_moderator",
    PACKED: "packed",
    ASSIGNED_TO_COURIER: "assigned_to_courier",
    IN_DELIVERY: "in_delivery",
    DELIVERED: "delivered",
    CANCELED: "canceled"
};

export const ORDER_STATUS_TYPES_LIST = Object.values(ORDER_STATUS_TYPES);

// =============================================================================
// SUPPORT TICKET STATUS TYPES
// =============================================================================

export const TICKET_STATUS_TYPES = {
    OPEN: "open",
    ASSIGNED: "assigned",
    RESOLVED: "resolved",
    CLOSED: "closed"
};

export const TICKET_STATUS_TYPES_LIST = Object.values(TICKET_STATUS_TYPES);

// =============================================================================
// ERROR TYPES
// =============================================================================

export const ERROR_TYPES = {
    VALIDATION_ERROR: "ValidationError",
    UNAUTHORIZED_ERROR: "UnauthorizedError",
    NOT_FOUND_ERROR: "NotFoundError",
    CAST_ERROR: "CastError",
    APP_ERROR: "AppError",
    INTERNAL_SERVER_ERROR: "InternalServerError"
};

export const ERROR_TYPES_LIST = Object.values(ERROR_TYPES);

// =============================================================================
// CATEGORY TYPES (Apple Store Categories)
// =============================================================================

export const CATEGORY_TYPES = {
    ELECTRONICS: "electronics",
    ACCESSORIES: "accessories",
    DESKTOPS_MONITORS: "desktops_monitors"
};

export const CATEGORY_TYPES_LIST = Object.values(CATEGORY_TYPES);

// =============================================================================
// SUBCATEGORY TYPES
// =============================================================================

export const SUBCATEGORY_TYPES = {
    // Electronics
    SMARTPHONES: "smartphones",
    LAPTOPS: "laptops",
    TABLETS: "tablets",
    SMART_WATCHES: "smart_watches",
    HEADPHONES: "headphones",
    DESKTOPS: "desktops",
    MONITORS: "monitors",

    // Accessories
    CHARGERS: "chargers",
    CABLES: "cables",
    CASES: "cases",
    ADAPTERS: "adapters",
    KEYBOARDS: "keyboards",
    MICE: "mice",
    APPLE_PENCIL: "apple_pencil",
    HUBS_DOCKS: "hubs_docks"
};

export const SUBCATEGORY_TYPES_LIST = Object.values(SUBCATEGORY_TYPES);

// =============================================================================
// CATEGORY TREE (Category -> Subcategories mapping)
// =============================================================================

export const CATEGORY_TREE = {
    [CATEGORY_TYPES.ELECTRONICS]: [
        SUBCATEGORY_TYPES.SMARTPHONES,
        SUBCATEGORY_TYPES.LAPTOPS,
        SUBCATEGORY_TYPES.TABLETS,
        SUBCATEGORY_TYPES.SMART_WATCHES,
        SUBCATEGORY_TYPES.HEADPHONES,
        SUBCATEGORY_TYPES.DESKTOPS
    ],
    [CATEGORY_TYPES.ACCESSORIES]: [
        SUBCATEGORY_TYPES.CHARGERS,
        SUBCATEGORY_TYPES.CABLES,
        SUBCATEGORY_TYPES.CASES,
        SUBCATEGORY_TYPES.ADAPTERS,
        SUBCATEGORY_TYPES.KEYBOARDS,
        SUBCATEGORY_TYPES.MICE,
        SUBCATEGORY_TYPES.APPLE_PENCIL,
        SUBCATEGORY_TYPES.HUBS_DOCKS
    ],
    [CATEGORY_TYPES.DESKTOPS_MONITORS]: [
        SUBCATEGORY_TYPES.DESKTOPS,
        SUBCATEGORY_TYPES.MONITORS
    ]
};

export const CATEGORY_TREE_LIST = Object.values(CATEGORY_TREE);

// =============================================================================
// ATTRIBUTE DEFINITIONS (per subcategory)
// =============================================================================

export const ATTRIBUTE_DEFINITIONS = {
    // Electronics - Smartphones
    [SUBCATEGORY_TYPES.SMARTPHONES]: [
        { key: "display", label: "Display", type: "string" },
        { key: "display_size", label: "Display Size", type: "number", unit: "inch" },
        { key: "processor", label: "Processor", type: "string" },
        { key: "battery", label: "Battery Capacity", type: "number", unit: "mAh" },
        { key: "storage", label: "Storage", type: "number", unit: "GB" },
        { key: "ram", label: "RAM", type: "number", unit: "GB" },
        { key: "camera_main", label: "Main Camera", type: "string" },
        { key: "camera_front", label: "Front Camera", type: "string" },
        { key: "sim_type", label: "SIM Type", type: "string" },
        { key: "color", label: "Color", type: "string" },
        { key: "weight", label: "Weight", type: "number", unit: "g" },
        { key: "water_resistance", label: "Water Resistance", type: "string" }
    ],

    // Electronics - Laptops
    [SUBCATEGORY_TYPES.LAPTOPS]: [
        { key: "processor", label: "Processor", type: "string" },
        { key: "ram", label: "RAM", type: "number", unit: "GB" },
        { key: "storage_type", label: "Storage Type", type: "string" },
        { key: "storage", label: "Storage", type: "number", unit: "GB" },
        { key: "display", label: "Display Size", type: "number", unit: "inch" },
        { key: "display_resolution", label: "Display Resolution", type: "string" },
        { key: "graphics", label: "Graphics", type: "string" },
        { key: "battery_life", label: "Battery Life", type: "string" },
        { key: "ports", label: "Ports", type: "string" },
        { key: "touch_bar", label: "Touch Bar", type: "boolean" },
        { key: "color", label: "Color", type: "string" },
        { key: "weight", label: "Weight", type: "number", unit: "kg" }
    ],

    // Electronics - Tablets
    [SUBCATEGORY_TYPES.TABLETS]: [
        { key: "display", label: "Display Size", type: "number", unit: "inch" },
        { key: "display_resolution", label: "Display Resolution", type: "string" },
        { key: "processor", label: "Processor", type: "string" },
        { key: "ram", label: "RAM", type: "number", unit: "GB" },
        { key: "storage", label: "Storage", type: "number", unit: "GB" },
        { key: "battery", label: "Battery Life", type: "string" },
        { key: "camera_main", label: "Main Camera", type: "string" },
        { key: "camera_front", label: "Front Camera", type: "string" },
        { key: "cellular", label: "Cellular Support", type: "boolean" },
        { key: "apple_pencil_support", label: "Apple Pencil Support", type: "boolean" },
        { key: "color", label: "Color", type: "string" },
        { key: "weight", label: "Weight", type: "number", unit: "g" }
    ],

    // Electronics - Smart Watches
    [SUBCATEGORY_TYPES.SMART_WATCHES]: [
        { key: "case_size", label: "Case Size", type: "number", unit: "mm" },
        { key: "display", label: "Display", type: "string" },
        { key: "water_resistance", label: "Water Resistance", type: "string" },
        { key: "battery_life", label: "Battery Life", type: "string" },
        { key: "gps", label: "GPS", type: "boolean" },
        { key: "cellular", label: "Cellular", type: "boolean" },
        { key: "heart_rate", label: "Heart Rate Monitor", type: "boolean" },
        { key: "ecg", label: "ECG", type: "boolean" },
        { key: "color", label: "Color", type: "string" },
        { key: "band_material", label: "Band Material", type: "string" }
    ],

    // Electronics - Headphones
    [SUBCATEGORY_TYPES.HEADPHONES]: [
        { key: "type", label: "Type", type: "string" },
        { key: "wireless", label: "Wireless", type: "boolean" },
        { key: "noise_canceling", label: "Active Noise Cancellation", type: "boolean" },
        { key: "transparency_mode", label: "Transparency Mode", type: "boolean" },
        { key: "spatial_audio", label: "Spatial Audio", type: "boolean" },
        { key: "battery_life", label: "Battery Life", type: "string" },
        { key: "charging_case", label: "Charging Case", type: "boolean" },
        { key: "color", label: "Color", type: "string" },
        { key: "weight", label: "Weight", type: "number", unit: "g" }
    ],

    // Electronics - Desktops
    [SUBCATEGORY_TYPES.DESKTOPS]: [
        { key: "processor", label: "Processor", type: "string" },
        { key: "ram", label: "RAM", type: "number", unit: "GB" },
        { key: "storage_type", label: "Storage Type", type: "string" },
        { key: "storage", label: "Storage", type: "number", unit: "GB" },
        { key: "graphics", label: "Graphics", type: "string" },
        { key: "ports", label: "Ports", type: "string" },
        { key: "bluetooth", label: "Bluetooth", type: "string" },
        { key: "wifi", label: "Wi-Fi", type: "string" },
        { key: "color", label: "Color", type: "string" },
        { key: "weight", label: "Weight", type: "number", unit: "kg" }
    ],

    // Electronics - Monitors
    [SUBCATEGORY_TYPES.MONITORS]: [
        { key: "display_size", label: "Display Size", type: "number", unit: "inch" },
        { key: "resolution", label: "Resolution", type: "string" },
        { key: "panel_type", label: "Panel Type", type: "string" },
        { key: "refresh_rate", label: "Refresh Rate", type: "number", unit: "Hz" },
        { key: "response_time", label: "Response Time", type: "number", unit: "ms" },
        { key: "brightness", label: "Brightness", type: "number", unit: "nits" },
        { key: "ports", label: "Ports", type: "string" },
        { key: "hdr", label: "HDR Support", type: "boolean" },
        { key: "color", label: "Color", type: "string" },
        { key: "height_adjustable", label: "Height Adjustable", type: "boolean" }
    ],

    // Accessories - Chargers
    [SUBCATEGORY_TYPES.CHARGERS]: [
        { key: "power", label: "Power Output", type: "number", unit: "W" },
        { key: "ports", label: "Number of Ports", type: "number" },
        { key: "fast_charging", label: "Fast Charging", type: "boolean" },
        { key: "type", label: "Charger Type", type: "string" },
        { key: "cable_included", label: "Cable Included", type: "boolean" },
        { key: "compatible_devices", label: "Compatible Devices", type: "string" }
    ],

    // Accessories - Cables
    [SUBCATEGORY_TYPES.CABLES]: [
        { key: "length", label: "Length", type: "number", unit: "m" },
        { key: "connector_type", label: "Connector Type", type: "string" },
        { key: "data_transfer", label: "Data Transfer Speed", type: "string" },
        { key: "fast_charging", label: "Fast Charging Support", type: "boolean" },
        { key: "braided", label: "Braided", type: "boolean" }
    ],

    // Accessories - Cases
    [SUBCATEGORY_TYPES.CASES]: [
        { key: "material", label: "Material", type: "string" },
        { key: "color", label: "Color", type: "string" },
        { key: "wireless_charging", label: "Wireless Charging Compatible", type: "boolean" },
        { key: "magsafe", label: "MagSafe Compatible", type: "boolean" },
        { key: "shock_absorbent", label: "Shock Absorbent", type: "boolean" },
        { key: "compatible_model", label: "Compatible Model", type: "string" }
    ],

    // Accessories - Adapters
    [SUBCATEGORY_TYPES.ADAPTERS]: [
        { key: "input_type", label: "Input Type", type: "string" },
        { key: "output_type", label: "Output Type", type: "string" },
        { key: "ports", label: "Number of Ports", type: "number" },
        { key: "power_delivery", label: "Power Delivery", type: "boolean" },
        { key: "data_transfer", label: "Data Transfer Speed", type: "string" }
    ],

    // Accessories - Keyboards
    [SUBCATEGORY_TYPES.KEYBOARDS]: [
        { key: "type", label: "Type", type: "string" },
        { key: "layout", label: "Layout", type: "string" },
        { key: "backlight", label: "Backlight", type: "boolean" },
        { key: "numeric_keypad", label: "Numeric Keypad", type: "boolean" },
        { key: "touch_bar", label: "Touch Bar", type: "boolean" },
        { key: "connection", label: "Connection Type", type: "string" },
        { key: "color", label: "Color", type: "string" },
        { key: "compatible_devices", label: "Compatible Devices", type: "string" }
    ],

    // Accessories - Mice
    [SUBCATEGORY_TYPES.MICE]: [
        { key: "type", label: "Type", type: "string" },
        { key: "dpi", label: "DPI", type: "number" },
        { key: "buttons", label: "Number of Buttons", type: "number" },
        { key: "scroll_wheel", label: "Scroll Wheel", type: "boolean" },
        { key: "connection", label: "Connection Type", type: "string" },
        { key: "color", label: "Color", type: "string" },
        { key: "compatible_devices", label: "Compatible Devices", type: "string" }
    ],

    // Accessories - Apple Pencil
    [SUBCATEGORY_TYPES.APPLE_PENCIL]: [
        { key: "generation", label: "Generation", type: "string" },
        { key: "pressure_sensitivity", label: "Pressure Sensitivity", type: "boolean" },
        { key: "tilt_sensitivity", label: "Tilt Sensitivity", type: "boolean" },
        { key: "magnetic_charging", label: "Magnetic Charging", type: "boolean" },
        { key: "compatible_devices", label: "Compatible Devices", type: "string" }
    ],

    // Accessories - Hubs & Docks
    [SUBCATEGORY_TYPES.HUBS_DOCKS]: [
        { key: "ports", label: "Ports", type: "string" },
        { key: "usb_ports", label: "USB Ports", type: "number" },
        { key: "hdmi_ports", label: "HDMI Ports", type: "number" },
        { key: "display_output", label: "Display Output", type: "string" },
        { key: "sd_card_reader", label: "SD Card Reader", type: "boolean" },
        { key: "power_delivery", label: "Power Delivery", type: "number", unit: "W" },
        { key: "ethernet", label: "Ethernet Port", type: "boolean" },
        { key: "audio_jack", label: "Audio Jack", type: "boolean" }
    ]
};

// =============================================================================
// CATEGORY AND SUBCATEGORY NAMES (for seeding)
// =============================================================================

export const CATEGORY_NAMES = {
    [CATEGORY_TYPES.ELECTRONICS]: "Electronics",
    [CATEGORY_TYPES.ACCESSORIES]: "Accessories",
    [CATEGORY_TYPES.DESKTOPS_MONITORS]: "Desktops & Monitors"
};

export const SUBCATEGORY_NAMES = {
    // Electronics
    [SUBCATEGORY_TYPES.SMARTPHONES]: "Smartphones",
    [SUBCATEGORY_TYPES.LAPTOPS]: "Laptops",
    [SUBCATEGORY_TYPES.TABLETS]: "Tablets",
    [SUBCATEGORY_TYPES.SMART_WATCHES]: "Smart Watches",
    [SUBCATEGORY_TYPES.HEADPHONES]: "Headphones",
    [SUBCATEGORY_TYPES.DESKTOPS]: "Desktops",
    [SUBCATEGORY_TYPES.MONITORS]: "Monitors",

    // Accessories
    [SUBCATEGORY_TYPES.CHARGERS]: "Chargers",
    [SUBCATEGORY_TYPES.CABLES]: "Cables",
    [SUBCATEGORY_TYPES.CASES]: "Cases",
    [SUBCATEGORY_TYPES.ADAPTERS]: "Adapters",
    [SUBCATEGORY_TYPES.KEYBOARDS]: "Keyboards",
    [SUBCATEGORY_TYPES.MICE]: "Mice",
    [SUBCATEGORY_TYPES.APPLE_PENCIL]: "Apple Pencil",
    [SUBCATEGORY_TYPES.HUBS_DOCKS]: "Hubs & Docks"
};

// =============================================================================
// ROLE PERMISSIONS (for reference)
// =============================================================================

export const ROLE_PERMISSIONS = {
    [USER_ROLE_TYPES.USER]: [
        "view_catalog",
        "manage_cart",
        "create_orders",
        "view_own_orders",
        "create_support_tickets",
        "view_own_tickets",
        "manage_own_profile"
    ],
    [USER_ROLE_TYPES.MODERATOR]: [
        "view_catalog",
        "manage_cart",
        "create_orders",
        "view_own_orders",
        "create_support_tickets",
        "view_own_tickets",
        "manage_own_profile",
        "manage_inventory",
        "accept_orders",
        "pack_orders",
        "assign_orders_to_courier",
        "view_sales_metrics"
    ],
    [USER_ROLE_TYPES.COURIER]: [
        "view_catalog",
        "manage_cart",
        "create_orders",
        "view_own_orders",
        "create_support_tickets",
        "view_own_tickets",
        "manage_own_profile",
        "view_delivery_orders",
        "accept_delivery",
        "update_delivery_status"
    ],
    [USER_ROLE_TYPES.SUPPORT]: [
        "view_catalog",
        "manage_cart",
        "create_orders",
        "view_own_orders",
        "create_support_tickets",
        "view_own_tickets",
        "manage_own_profile",
        "view_support_tickets",
        "accept_ticket",
        "resolve_ticket",
        "close_ticket"
    ],
    [USER_ROLE_TYPES.ADMIN]: [
        "view_catalog",
        "manage_cart",
        "create_orders",
        "view_own_orders",
        "create_support_tickets",
        "view_own_tickets",
        "manage_own_profile",
        "manage_users",
        "manage_roles",
        "manage_products",
        "enable_disable_categories",
        "view_dashboards",
        "view_metrics",
        "view_logs",
        "view_sales_statistics"
    ],
    [USER_ROLE_TYPES.DEVELOPER]: [
        "view_catalog",
        "manage_cart",
        "create_orders",
        "view_own_orders",
        "create_support_tickets",
        "view_own_tickets",
        "manage_own_profile",
        "view_all_users",
        "view_logs",
        "view_system_metrics",
        "view_dashboards"
    ]
};

// =============================================================================
// DELIVERY STATUS DISPLAY LABELS
// =============================================================================

export const ORDER_STATUS_LABELS = {
    [ORDER_STATUS_TYPES.CREATED]: "Order Created",
    [ORDER_STATUS_TYPES.ACCEPTED_BY_MODERATOR]: "Accepted by Moderator",
    [ORDER_STATUS_TYPES.PACKED]: "Packed",
    [ORDER_STATUS_TYPES.ASSIGNED_TO_COURIER]: "Assigned to Courier",
    [ORDER_STATUS_TYPES.IN_DELIVERY]: "In Delivery",
    [ORDER_STATUS_TYPES.DELIVERED]: "Delivered",
    [ORDER_STATUS_TYPES.CANCELED]: "Canceled"
};

// =============================================================================
// TICKET STATUS LABELS
// =============================================================================

export const TICKET_STATUS_LABELS = {
    [TICKET_STATUS_TYPES.OPEN]: "Open",
    [TICKET_STATUS_TYPES.ASSIGNED]: "Assigned",
    [TICKET_STATUS_TYPES.RESOLVED]: "Resolved",
    [TICKET_STATUS_TYPES.CLOSED]: "Closed"
};
