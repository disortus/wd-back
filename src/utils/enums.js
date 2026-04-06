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

export const STAFF_ROLE_TYPES = {
    MODERATOR: USER_ROLE_TYPES.MODERATOR,
    COURIER: USER_ROLE_TYPES.COURIER,
    SUPPORT: USER_ROLE_TYPES.SUPPORT,
    DEVELOPER: USER_ROLE_TYPES.DEVELOPER
};

export const STAFF_ROLE_TYPES_LIST = Object.values(STAFF_ROLE_TYPES);

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
    AUDIO_WEARABLES: "audio_wearables",
    ACCESSORIES: "accessories",
    DESKTOPS_MONITORS: "desktops_monitors",
    TV_HOME: "tv_home"
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

    // Audio & Wearables
    SMART_WATCHES: "smart_watches",
    HEADPHONES: "headphones",
    SPEAKERS: "speakers",

    // Desktops & Monitors
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
    HUBS_DOCKS: "hubs_docks",

    // TV & Home
    STREAMING_DEVICES: "streaming_devices",
    SMART_HOME: "smart_home"
};

export const SUBCATEGORY_TYPES_LIST = Object.values(SUBCATEGORY_TYPES);

// =============================================================================
// CATEGORY TREE (Category -> Subcategories mapping)
// =============================================================================

export const CATEGORY_TREE = {
    [CATEGORY_TYPES.ELECTRONICS]: [
        SUBCATEGORY_TYPES.SMARTPHONES,
        SUBCATEGORY_TYPES.LAPTOPS,
        SUBCATEGORY_TYPES.TABLETS
    ],
    [CATEGORY_TYPES.AUDIO_WEARABLES]: [
        SUBCATEGORY_TYPES.SMART_WATCHES,
        SUBCATEGORY_TYPES.HEADPHONES,
        SUBCATEGORY_TYPES.SPEAKERS
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
    ],
    [CATEGORY_TYPES.TV_HOME]: [
        SUBCATEGORY_TYPES.STREAMING_DEVICES,
        SUBCATEGORY_TYPES.SMART_HOME
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
        { key: "refresh_rate", label: "Refresh Rate", type: "number", unit: "Hz" },
        { key: "processor", label: "Processor", type: "string" },
        { key: "chip_generation", label: "Chip Generation", type: "string" },
        { key: "battery", label: "Battery Capacity", type: "number", unit: "mAh" },
        { key: "storage", label: "Storage", type: "number", unit: "GB" },
        { key: "ram", label: "RAM", type: "number", unit: "GB" },
        { key: "camera_main", label: "Main Camera", type: "string" },
        { key: "camera_front", label: "Front Camera", type: "string" },
        { key: "video_recording", label: "Video Recording", type: "string" },
        { key: "sim_type", label: "SIM Type", type: "string" },
        { key: "face_id", label: "Face ID", type: "boolean" },
        { key: "wireless_charging", label: "Wireless Charging", type: "boolean" },
        { key: "color", label: "Color", type: "string" },
        { key: "weight", label: "Weight", type: "number", unit: "g" },
        { key: "water_resistance", label: "Water Resistance", type: "string" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // Electronics - Laptops
    [SUBCATEGORY_TYPES.LAPTOPS]: [
        { key: "processor", label: "Processor", type: "string" },
        { key: "cpu_cores", label: "CPU Cores", type: "number" },
        { key: "gpu_cores", label: "GPU Cores", type: "number" },
        { key: "ram", label: "RAM", type: "number", unit: "GB" },
        { key: "storage_type", label: "Storage Type", type: "string" },
        { key: "storage", label: "Storage", type: "number", unit: "GB" },
        { key: "display", label: "Display Size", type: "number", unit: "inch" },
        { key: "display_resolution", label: "Display Resolution", type: "string" },
        { key: "display_technology", label: "Display Technology", type: "string" },
        { key: "graphics", label: "Graphics", type: "string" },
        { key: "battery_life", label: "Battery Life", type: "string" },
        { key: "ports", label: "Ports", type: "string" },
        { key: "camera", label: "Built-in Camera", type: "string" },
        { key: "wireless", label: "Wireless Connectivity", type: "string" },
        { key: "touch_bar", label: "Touch Bar", type: "boolean" },
        { key: "color", label: "Color", type: "string" },
        { key: "weight", label: "Weight", type: "number", unit: "kg" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // Electronics - Tablets
    [SUBCATEGORY_TYPES.TABLETS]: [
        { key: "display", label: "Display Size", type: "number", unit: "inch" },
        { key: "display_resolution", label: "Display Resolution", type: "string" },
        { key: "display_type", label: "Display Type", type: "string" },
        { key: "processor", label: "Processor", type: "string" },
        { key: "ram", label: "RAM", type: "number", unit: "GB" },
        { key: "storage", label: "Storage", type: "number", unit: "GB" },
        { key: "battery", label: "Battery Life", type: "string" },
        { key: "camera_main", label: "Main Camera", type: "string" },
        { key: "camera_front", label: "Front Camera", type: "string" },
        { key: "cellular", label: "Cellular Support", type: "boolean" },
        { key: "apple_pencil_support", label: "Apple Pencil Support", type: "boolean" },
        { key: "keyboard_support", label: "Keyboard Support", type: "boolean" },
        { key: "color", label: "Color", type: "string" },
        { key: "weight", label: "Weight", type: "number", unit: "g" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // Audio & Wearables - Smart Watches
    [SUBCATEGORY_TYPES.SMART_WATCHES]: [
        { key: "case_size", label: "Case Size", type: "number", unit: "mm" },
        { key: "display", label: "Display", type: "string" },
        { key: "processor", label: "Processor", type: "string" },
        { key: "water_resistance", label: "Water Resistance", type: "string" },
        { key: "battery_life", label: "Battery Life", type: "string" },
        { key: "gps", label: "GPS", type: "boolean" },
        { key: "cellular", label: "Cellular", type: "boolean" },
        { key: "heart_rate", label: "Heart Rate Monitor", type: "boolean" },
        { key: "ecg", label: "ECG", type: "boolean" },
        { key: "temperature_sensor", label: "Temperature Sensor", type: "boolean" },
        { key: "color", label: "Color", type: "string" },
        { key: "band_material", label: "Band Material", type: "string" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // Audio & Wearables - Headphones
    [SUBCATEGORY_TYPES.HEADPHONES]: [
        { key: "type", label: "Type", type: "string" },
        { key: "wireless", label: "Wireless", type: "boolean" },
        { key: "chip", label: "Audio Chip", type: "string" },
        { key: "noise_canceling", label: "Active Noise Cancellation", type: "boolean" },
        { key: "transparency_mode", label: "Transparency Mode", type: "boolean" },
        { key: "spatial_audio", label: "Spatial Audio", type: "boolean" },
        { key: "battery_life", label: "Battery Life", type: "string" },
        { key: "charging_case", label: "Charging Case", type: "boolean" },
        { key: "sweat_resistance", label: "Sweat Resistance", type: "string" },
        { key: "color", label: "Color", type: "string" },
        { key: "weight", label: "Weight", type: "number", unit: "g" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // Audio & Wearables - Speakers
    [SUBCATEGORY_TYPES.SPEAKERS]: [
        { key: "speaker_type", label: "Speaker Type", type: "string" },
        { key: "voice_assistant", label: "Voice Assistant", type: "string" },
        { key: "room_sensing", label: "Room Sensing", type: "boolean" },
        { key: "stereo_pair", label: "Stereo Pair Support", type: "boolean" },
        { key: "wireless", label: "Wireless", type: "boolean" },
        { key: "connectivity", label: "Connectivity", type: "string" },
        { key: "power_source", label: "Power Source", type: "string" },
        { key: "color", label: "Color", type: "string" },
        { key: "weight", label: "Weight", type: "number", unit: "g" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // Desktops & Monitors - Desktops
    [SUBCATEGORY_TYPES.DESKTOPS]: [
        { key: "processor", label: "Processor", type: "string" },
        { key: "cpu_cores", label: "CPU Cores", type: "number" },
        { key: "gpu_cores", label: "GPU Cores", type: "number" },
        { key: "ram", label: "RAM", type: "number", unit: "GB" },
        { key: "storage_type", label: "Storage Type", type: "string" },
        { key: "storage", label: "Storage", type: "number", unit: "GB" },
        { key: "graphics", label: "Graphics", type: "string" },
        { key: "ports", label: "Ports", type: "string" },
        { key: "bluetooth", label: "Bluetooth", type: "string" },
        { key: "wifi", label: "Wi-Fi", type: "string" },
        { key: "ethernet", label: "Ethernet", type: "string" },
        { key: "color", label: "Color", type: "string" },
        { key: "weight", label: "Weight", type: "number", unit: "kg" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // Desktops & Monitors - Monitors
    [SUBCATEGORY_TYPES.MONITORS]: [
        { key: "display_size", label: "Display Size", type: "number", unit: "inch" },
        { key: "resolution", label: "Resolution", type: "string" },
        { key: "panel_type", label: "Panel Type", type: "string" },
        { key: "refresh_rate", label: "Refresh Rate", type: "number", unit: "Hz" },
        { key: "response_time", label: "Response Time", type: "number", unit: "ms" },
        { key: "brightness", label: "Brightness", type: "number", unit: "nits" },
        { key: "ports", label: "Ports", type: "string" },
        { key: "hdr", label: "HDR Support", type: "boolean" },
        { key: "webcam", label: "Built-in Webcam", type: "string" },
        { key: "speakers", label: "Built-in Speakers", type: "string" },
        { key: "color", label: "Color", type: "string" },
        { key: "height_adjustable", label: "Height Adjustable", type: "boolean" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // Accessories - Chargers
    [SUBCATEGORY_TYPES.CHARGERS]: [
        { key: "power", label: "Power Output", type: "number", unit: "W" },
        { key: "ports", label: "Number of Ports", type: "number" },
        { key: "fast_charging", label: "Fast Charging", type: "boolean" },
        { key: "type", label: "Charger Type", type: "string" },
        { key: "technology", label: "Technology", type: "string" },
        { key: "cable_included", label: "Cable Included", type: "boolean" },
        { key: "compatible_devices", label: "Compatible Devices", type: "string" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // Accessories - Cables
    [SUBCATEGORY_TYPES.CABLES]: [
        { key: "length", label: "Length", type: "number", unit: "m" },
        { key: "connector_type", label: "Connector Type", type: "string" },
        { key: "data_transfer", label: "Data Transfer Speed", type: "string" },
        { key: "power_delivery", label: "Power Delivery", type: "string" },
        { key: "fast_charging", label: "Fast Charging Support", type: "boolean" },
        { key: "braided", label: "Braided", type: "boolean" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // Accessories - Cases
    [SUBCATEGORY_TYPES.CASES]: [
        { key: "material", label: "Material", type: "string" },
        { key: "color", label: "Color", type: "string" },
        { key: "wireless_charging", label: "Wireless Charging Compatible", type: "boolean" },
        { key: "magsafe", label: "MagSafe Compatible", type: "boolean" },
        { key: "shock_absorbent", label: "Shock Absorbent", type: "boolean" },
        { key: "compatible_model", label: "Compatible Model", type: "string" },
        { key: "finish", label: "Finish", type: "string" }
    ],

    // Accessories - Adapters
    [SUBCATEGORY_TYPES.ADAPTERS]: [
        { key: "input_type", label: "Input Type", type: "string" },
        { key: "output_type", label: "Output Type", type: "string" },
        { key: "ports", label: "Number of Ports", type: "number" },
        { key: "power_delivery", label: "Power Delivery", type: "boolean" },
        { key: "data_transfer", label: "Data Transfer Speed", type: "string" },
        { key: "display_support", label: "Display Support", type: "string" }
    ],

    // Accessories - Keyboards
    [SUBCATEGORY_TYPES.KEYBOARDS]: [
        { key: "type", label: "Type", type: "string" },
        { key: "layout", label: "Layout", type: "string" },
        { key: "backlight", label: "Backlight", type: "boolean" },
        { key: "numeric_keypad", label: "Numeric Keypad", type: "boolean" },
        { key: "touch_bar", label: "Touch Bar", type: "boolean" },
        { key: "touch_id", label: "Touch ID", type: "boolean" },
        { key: "connection", label: "Connection Type", type: "string" },
        { key: "color", label: "Color", type: "string" },
        { key: "compatible_devices", label: "Compatible Devices", type: "string" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // Accessories - Mice
    [SUBCATEGORY_TYPES.MICE]: [
        { key: "type", label: "Type", type: "string" },
        { key: "dpi", label: "DPI", type: "number" },
        { key: "buttons", label: "Number of Buttons", type: "number" },
        { key: "scroll_wheel", label: "Scroll Wheel", type: "boolean" },
        { key: "connection", label: "Connection Type", type: "string" },
        { key: "gestures", label: "Gesture Support", type: "boolean" },
        { key: "color", label: "Color", type: "string" },
        { key: "compatible_devices", label: "Compatible Devices", type: "string" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // Accessories - Apple Pencil
    [SUBCATEGORY_TYPES.APPLE_PENCIL]: [
        { key: "generation", label: "Generation", type: "string" },
        { key: "pressure_sensitivity", label: "Pressure Sensitivity", type: "boolean" },
        { key: "tilt_sensitivity", label: "Tilt Sensitivity", type: "boolean" },
        { key: "magnetic_charging", label: "Magnetic Charging", type: "boolean" },
        { key: "hover_support", label: "Hover Support", type: "boolean" },
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
        { key: "audio_jack", label: "Audio Jack", type: "boolean" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // TV & Home - Streaming Devices
    [SUBCATEGORY_TYPES.STREAMING_DEVICES]: [
        { key: "processor", label: "Processor", type: "string" },
        { key: "resolution", label: "Max Resolution", type: "string" },
        { key: "hdr", label: "HDR Formats", type: "string" },
        { key: "storage", label: "Storage", type: "number", unit: "GB" },
        { key: "connectivity", label: "Connectivity", type: "string" },
        { key: "remote", label: "Remote Included", type: "string" },
        { key: "smart_home_hub", label: "Smart Home Hub", type: "boolean" },
        { key: "gaming_support", label: "Gaming Support", type: "boolean" },
        { key: "color", label: "Color", type: "string" },
        { key: "warranty", label: "Warranty", type: "string" }
    ],

    // TV & Home - Smart Home
    [SUBCATEGORY_TYPES.SMART_HOME]: [
        { key: "device_type", label: "Device Type", type: "string" },
        { key: "voice_assistant", label: "Voice Assistant", type: "string" },
        { key: "connectivity", label: "Connectivity", type: "string" },
        { key: "matter_support", label: "Matter Support", type: "boolean" },
        { key: "thread_border_router", label: "Thread Border Router", type: "boolean" },
        { key: "power_source", label: "Power Source", type: "string" },
        { key: "sensor_package", label: "Sensors", type: "string" },
        { key: "color", label: "Color", type: "string" },
        { key: "warranty", label: "Warranty", type: "string" }
    ]
};

// =============================================================================
// CATEGORY AND SUBCATEGORY NAMES (for seeding)
// =============================================================================

export const CATEGORY_NAMES = {
    [CATEGORY_TYPES.ELECTRONICS]: "Electronics",
    [CATEGORY_TYPES.AUDIO_WEARABLES]: "Audio & Wearables",
    [CATEGORY_TYPES.ACCESSORIES]: "Accessories",
    [CATEGORY_TYPES.DESKTOPS_MONITORS]: "Desktops & Monitors",
    [CATEGORY_TYPES.TV_HOME]: "TV & Home"
};

export const SUBCATEGORY_NAMES = {
    // Electronics
    [SUBCATEGORY_TYPES.SMARTPHONES]: "Smartphones",
    [SUBCATEGORY_TYPES.LAPTOPS]: "Laptops",
    [SUBCATEGORY_TYPES.TABLETS]: "Tablets",

    // Audio & Wearables
    [SUBCATEGORY_TYPES.SMART_WATCHES]: "Smart Watches",
    [SUBCATEGORY_TYPES.HEADPHONES]: "Headphones",
    [SUBCATEGORY_TYPES.SPEAKERS]: "Speakers",

    // Desktops & Monitors
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
    [SUBCATEGORY_TYPES.HUBS_DOCKS]: "Hubs & Docks",

    // TV & Home
    [SUBCATEGORY_TYPES.STREAMING_DEVICES]: "Streaming Devices",
    [SUBCATEGORY_TYPES.SMART_HOME]: "Smart Home"
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
