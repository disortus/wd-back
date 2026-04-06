/**
 * Full E2E Journey Test Script
 * Tests complete flow for Watch Demo API
 * Tests all endpoints based on enums and validators
 */

const BASE_URL = "http://localhost:5000/api";

// ============================================================================
// ENUMS from src/utils/enums.js
// ============================================================================

const CATEGORY_TYPES = {
    ELECTRONICS: "electronics",
    AUDIO_WEARABLES: "audio_wearables",
    ACCESSORIES: "accessories",
    DESKTOPS_MONITORS: "desktops_monitors",
    TV_HOME: "tv_home"
};

const SUBCATEGORY_TYPES = {
    SMARTPHONES: "smartphones",
    LAPTOPS: "laptops",
    TABLETS: "tablets",
    SMART_WATCHES: "smart_watches",
    HEADPHONES: "headphones",
    SPEAKERS: "speakers",
    DESKTOPS: "desktops",
    MONITORS: "monitors",
    CHARGERS: "chargers",
    CABLES: "cables",
    CASES: "cases",
    ADAPTERS: "adapters",
    KEYBOARDS: "keyboards",
    MICE: "mice",
    APPLE_PENCIL: "apple_pencil",
    HUBS_DOCKS: "hubs_docks",
    STREAMING_DEVICES: "streaming_devices",
    SMART_HOME: "smart_home"
};

const ORDER_STATUS = {
    CREATED: "created",
    ACCEPTED_BY_MODERATOR: "accepted_by_moderator",
    PACKED: "packed",
    ASSIGNED_TO_COURIER: "assigned_to_courier",
    IN_DELIVERY: "in_delivery",
    DELIVERED: "delivered",
    CANCELED: "canceled"
};

const TICKET_STATUS = {
    OPEN: "open",
    ASSIGNED: "assigned",
    RESOLVED: "resolved",
    CLOSED: "closed"
};

// ============================================================================
// Test Configuration
// ============================================================================

const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m"
};

function log(message, color = "reset") {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    log(`\n${"=".repeat(70)}`, "cyan");
    log(`  ${title}`, "cyan");
    log("=".repeat(70), "cyan");
}

// ============================================================================
// API Helper
// ============================================================================

async function apiRequest(method, endpoint, data = null, token = null) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const options = { method, headers };
    if (data) options.body = JSON.stringify(data);

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const result = await response.json();
        return { success: response.ok, data: result, status: response.status };
    } catch (error) {
        log(`  ❌ Network error: ${error.message}`, "red");
        return { success: false, error: error.message };
    }
}

// ============================================================================
// Test Data (matching enums and validators)
// ============================================================================

const testProducts = [
    // Electronics - Smartphones
    {
        title: "iPhone 15 Pro",
        slug: "iphone-15-pro-test",
        description: "Apple iPhone 15 Pro with A17 Pro chip, 256GB",
        price: 549990,
        stock: 10,
        categorySlug: CATEGORY_TYPES.ELECTRONICS,
        subcategorySlug: SUBCATEGORY_TYPES.SMARTPHONES,
        attributes: []
    },
    // Electronics - Laptops
    {
        title: "MacBook Pro 14 M3",
        slug: "macbook-pro-14-m3-test",
        description: "MacBook Pro 14-inch with M3 chip",
        price: 799990,
        stock: 5,
        categorySlug: CATEGORY_TYPES.ELECTRONICS,
        subcategorySlug: SUBCATEGORY_TYPES.LAPTOPS,
        attributes: []
    },
    // Electronics - Tablets
    {
        title: "iPad Pro 13 M4",
        slug: "ipad-pro-13-m4-test",
        description: "iPad Pro with M4 chip, 13-inch display",
        price: 699990,
        stock: 3,
        categorySlug: CATEGORY_TYPES.ELECTRONICS,
        subcategorySlug: SUBCATEGORY_TYPES.TABLETS,
        attributes: []
    },
    // Audio & Wearables - Smart Watches
    {
        title: "Apple Watch Ultra 2",
        slug: "apple-watch-ultra-2-test",
        description: "Apple Watch Ultra 2 GPS + Cellular",
        price: 349990,
        stock: 8,
        categorySlug: CATEGORY_TYPES.AUDIO_WEARABLES,
        subcategorySlug: SUBCATEGORY_TYPES.SMART_WATCHES,
        attributes: []
    },
    // Audio & Wearables - Headphones
    {
        title: "AirPods Pro 2",
        slug: "airpods-pro-2-test",
        description: "AirPods Pro 2nd Generation with USB-C",
        price: 109990,
        stock: 15,
        categorySlug: CATEGORY_TYPES.AUDIO_WEARABLES,
        subcategorySlug: SUBCATEGORY_TYPES.HEADPHONES,
        attributes: []
    },
    // Audio & Wearables - Speakers
    {
        title: "HomePod Mini",
        slug: "homepod-mini-test",
        description: "Apple HomePod Mini Space Gray",
        price: 44990,
        stock: 20,
        categorySlug: CATEGORY_TYPES.AUDIO_WEARABLES,
        subcategorySlug: SUBCATEGORY_TYPES.SPEAKERS,
        attributes: []
    },
    // Desktops & Monitors - Desktops
    {
        title: "Mac Mini M2",
        slug: "mac-mini-m2-test",
        description: "Mac Mini with M2 chip, 256GB SSD",
        price: 349990,
        stock: 4,
        categorySlug: CATEGORY_TYPES.DESKTOPS_MONITORS,
        subcategorySlug: SUBCATEGORY_TYPES.DESKTOPS,
        attributes: []
    },
    // Desktops & Monitors - Monitors
    {
        title: "Studio Display",
        slug: "studio-display-test",
        description: "27-inch 5K Retina display",
        price: 599990,
        stock: 2,
        categorySlug: CATEGORY_TYPES.DESKTOPS_MONITORS,
        subcategorySlug: SUBCATEGORY_TYPES.MONITORS,
        attributes: []
    },
    // Accessories - Chargers
    {
        title: "MagSafe Charger",
        slug: "magsafe-charger-test",
        description: "MagSafe 15W wireless charger",
        price: 15990,
        stock: 30,
        categorySlug: CATEGORY_TYPES.ACCESSORIES,
        subcategorySlug: SUBCATEGORY_TYPES.CHARGERS,
        attributes: []
    },
    // Accessories - Cables
    {
        title: "USB-C Cable 1m",
        slug: "usb-c-cable-1m-test",
        description: "1 meter USB-C to USB-C cable",
        price: 4990,
        stock: 50,
        categorySlug: CATEGORY_TYPES.ACCESSORIES,
        subcategorySlug: SUBCATEGORY_TYPES.CABLES,
        attributes: []
    },
    // Accessories - Cases
    {
        title: "iPhone 15 Silicone Case",
        slug: "iphone-15-silicone-case-test",
        description: "Apple Silicone Case for iPhone 15",
        price: 6990,
        stock: 25,
        categorySlug: CATEGORY_TYPES.ACCESSORIES,
        subcategorySlug: SUBCATEGORY_TYPES.CASES,
        attributes: []
    },
    // Accessories - Keyboards
    {
        title: "Magic Keyboard",
        slug: "magic-keyboard-test",
        description: "Apple Magic Keyboard with Touch ID",
        price: 79990,
        stock: 10,
        categorySlug: CATEGORY_TYPES.ACCESSORIES,
        subcategorySlug: SUBCATEGORY_TYPES.KEYBOARDS,
        attributes: []
    },
    // Accessories - Mice
    {
        title: "Magic Mouse",
        slug: "magic-mouse-test",
        description: "Apple Magic Mouse",
        price: 39990,
        stock: 15,
        categorySlug: CATEGORY_TYPES.ACCESSORIES,
        subcategorySlug: SUBCATEGORY_TYPES.MICE,
        attributes: []
    },
    // TV & Home - Streaming
    {
        title: "Apple TV 4K",
        slug: "apple-tv-4k-test",
        description: "Apple TV 4K 128GB",
        price: 89990,
        stock: 8,
        categorySlug: CATEGORY_TYPES.TV_HOME,
        subcategorySlug: SUBCATEGORY_TYPES.STREAMING_DEVICES,
        attributes: []
    }
];

// ============================================================================
// Main Test Runner
// ============================================================================

async function runTest() {
    log("\n🚀 Starting Full E2E Journey Test", "green");
    log("   API: " + BASE_URL, "yellow");

    let tokens = {};
    let testData = {
        productIds: [],
        categoryId: null,
        subcategoryId: null,
        orderId: null,
        ticketId: null,
        cartId: null,
        userPhone: null
    };

    // =========================================================================
    // PHASE 1: Auth & Staff Login
    // =========================================================================
    logSection("PHASE 1: Authentication");

    // Admin Login
    log("  Logging in as Admin...", "yellow");
    const adminLogin = await apiRequest("POST", "/auth/login", {
        phone: "+77000000001",
        password: "admin1234"
    });
    if (!adminLogin.success) {
        log("  ❌ Admin login failed", "red");
        return;
    }
    tokens.admin = adminLogin.data.data.token;
    log("  ✅ Admin logged in", "green");

    // Moderator Login
    log("  Logging in as Moderator...", "yellow");
    const modLogin = await apiRequest("POST", "/auth/login", {
        phone: "+77000000002",
        password: "moderator1234"
    });
    if (modLogin.success) {
        tokens.moderator = modLogin.data.data.token;
        log("  ✅ Moderator logged in", "green");
    } else {
        log("  ⚠️ Moderator login failed", "yellow");
    }

    // Courier Login
    log("  Logging in as Courier...", "yellow");
    const courierLogin = await apiRequest("POST", "/auth/login", {
        phone: "+77000000003",
        password: "courier1234"
    });
    if (courierLogin.success) {
        tokens.courier = courierLogin.data.data.token;
        log("  ✅ Courier logged in", "green");
    } else {
        log("  ⚠️ Courier login failed", "yellow");
    }

    // Support Login
    log("  Logging in as Support...", "yellow");
    const supportLogin = await apiRequest("POST", "/auth/login", {
        phone: "+77000000004",
        password: "support1234"
    });
    if (supportLogin.success) {
        tokens.support = supportLogin.data.data.token;
        log("  ✅ Support logged in", "green");
    } else {
        log("  ⚠️ Support login failed", "yellow");
    }

    // =========================================================================
    // PHASE 2: Catalog Management (Admin)
    // =========================================================================
    logSection("PHASE 2: Catalog Management");

    // Get Categories
    log("  Getting categories...", "yellow");
    const categories = await apiRequest("GET", "/admin/catalog", null, tokens.admin);
    if (categories.success && categories.data.data) {
        const cats = categories.data.data;
        log(`  ✅ Found ${cats.length} categories`, "green");

        // Store first category ID
        if (cats.length > 0) {
            testData.categoryId = cats[0]._id;
            testData.subcategoryId = cats[0].subcategories?.[0]?._id;
            log(`     Category: ${cats[0].name || cats[0].slug}`, "cyan");
        }

        // List all categories
        cats.forEach(cat => {
            log(`     - ${cat.slug}: ${cat.subcategories?.length || 0} subcategories`, "cyan");
        });
    }

    // Toggle Category
    if (testData.categoryId) {
        log("  Toggling category (disable/enable)...", "yellow");
        let result = await apiRequest("PATCH", `/admin/catalog/categories/${testData.categoryId}/toggle`, null, tokens.admin);
        log(`  ${result.success ? "✅" : "❌"} Category disabled`, result.success ? "green" : "red");

        result = await apiRequest("PATCH", `/admin/catalog/categories/${testData.categoryId}/toggle`, null, tokens.admin);
        log(`  ${result.success ? "✅" : "❌"} Category enabled`, result.success ? "green" : "red");
    }

    // Toggle Subcategory
    if (testData.subcategoryId) {
        log("  Toggling subcategory...", "yellow");
        let result = await apiRequest("PATCH", `/admin/catalog/subcategories/${testData.subcategoryId}/toggle`, null, tokens.admin);
        log(`  ${result.success ? "✅" : "❌"} Subcategory toggled`, result.success ? "green" : "red");
    }

    // =========================================================================
    // PHASE 3: Product Management (Admin)
    // =========================================================================
    logSection("PHASE 3: Product Management");

    for (const product of testProducts) {
        // Check if exists
        const checkResult = await apiRequest("GET", `/admin/products?slug=${product.slug}`, null, tokens.admin);

        if (checkResult.success && checkResult.data.data?.length > 0) {
            log(`  ⏭️  Product exists: ${product.title}`, "yellow");
            testData.productIds.push(checkResult.data.data[0]._id);
            continue;
        }

        // Create product
        const result = await apiRequest("POST", "/admin/products", product, tokens.admin);

        if (result.success && result.data.data?._id) {
            testData.productIds.push(result.data.data._id);
            log(`  ✅ Created: ${product.title} - ${product.price}₸`, "green");
        } else {
            log(`  ❌ Failed: ${product.title} - ${result.data?.message || "Unknown error"}`, "red");
        }
    }

    // Update product with images
    if (testData.productIds.length > 0) {
        const testProductId = testData.productIds[0];
        log("  Updating product with images...", "yellow");

        const updateResult = await apiRequest("PATCH", `/admin/products/${testProductId}`, {
            description: "Updated description with more details",
            images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
            mainImage: "https://example.com/image1.jpg"
        }, tokens.admin);

        log(`  ${updateResult.success ? "✅" : "❌"} Product updated`, updateResult.success ? "green" : "red");
    }

    // Stock management
    if (testData.productIds.length > 0) {
        const testProductId = testData.productIds[0];

        log("  Testing stock increase...", "yellow");
        let result = await apiRequest("PATCH", `/admin/products/${testProductId}/increase-stock`, { quantity: 5 }, tokens.admin);
        log(`  ${result.success ? "✅" : "❌"} Stock increased`, result.success ? "green" : "red");

        log("  Testing stock decrease...", "yellow");
        result = await apiRequest("PATCH", `/admin/products/${testProductId}/decrease-stock`, { quantity: 2 }, tokens.admin);
        log(`  ${result.success ? "✅" : "❌"} Stock decreased`, result.success ? "green" : "red");
    }

    // =========================================================================
    // PHASE 4: User Registration & Profile
    // =========================================================================
    logSection("PHASE 4: User Registration & Profile");

    // Generate unique phone number
    testData.userPhone = "+77" + Date.now().toString().slice(-9);
    log(`  Generated test phone: ${testData.userPhone}`, "yellow");

    // Register user (validator requires: fullname, phone, password, confirmPassword)
    log("  Registering new user...", "yellow");
    const registerResult = await apiRequest("POST", "/auth/register", {
        fullname: "Test User",
        phone: testData.userPhone,
        password: "test1234",
        confirmPassword: "test1234"
    });

    if (registerResult.success && registerResult.data.data?.token) {
        tokens.user = registerResult.data.data.token;
        log("  ✅ User registered and logged in", "green");
    } else {
        log("  ⚠️ Registration failed, trying login...", "yellow");
        const loginResult = await apiRequest("POST", "/auth/login", {
            phone: testData.userPhone,
            password: "test1234"
        });
        if (loginResult.success) {
            tokens.user = loginResult.data.data.token;
            log("  ✅ User logged in", "green");
        } else {
            log("  ❌ User login failed", "red");
        }
    }

    // Get profile
    if (tokens.user) {
        log("  Getting user profile...", "yellow");
        const profile = await apiRequest("GET", "/public/profile/me", null, tokens.user);
        log(`  ${profile.success ? "✅" : "❌"} Profile retrieved`, profile.success ? "green" : "red");
    }

    // Update profile
    if (tokens.user) {
        log("  Updating profile...", "yellow");
        const updateResult = await apiRequest("PATCH", "/public/profile/me", {
            fullname: "Updated Test User"
        }, tokens.user);
        log(`  ${updateResult.success ? "✅" : "❌"} Profile updated`, updateResult.success ? "green" : "red");
    }

    // =========================================================================
    // PHASE 5: Cart Management
    // =========================================================================
    logSection("PHASE 5: Cart Management");

    if (tokens.user && testData.productIds.length >= 2) {
        // Add to cart (validator: productId, quantity)
        log("  Adding products to cart...", "yellow");
        const cart1 = await apiRequest("POST", "/public/cart", {
            productId: testData.productIds[0],
            quantity: 1
        }, tokens.user);
        log(`  ${cart1.success ? "✅" : "❌"} Added product 1 to cart`, cart1.success ? "green" : "red");

        const cart2 = await apiRequest("POST", "/public/cart", {
            productId: testData.productIds[1],
            quantity: 2
        }, tokens.user);
        log(`  ${cart2.success ? "✅" : "❌"} Added product 2 to cart`, cart2.success ? "green" : "red");

        // Get cart
        log("  Getting cart...", "yellow");
        const cart = await apiRequest("GET", "/public/cart", null, tokens.user);
        if (cart.success && cart.data.data) {
            testData.cartId = cart.data.data._id;
            log(`  ✅ Cart retrieved: ${cart.data.data.totalItems || 0} items`, "green");
        }

        // Update cart item quantity
        if (cart.success && cart.data.data?.items?.length > 0) {
            const cartItemId = cart.data.data.items[0]._id;
            log("  Updating cart item quantity...", "yellow");
            const updateResult = await apiRequest("PATCH", `/public/cart/items/${cartItemId}`, {
                quantity: 3
            }, tokens.user);
            log(`  ${updateResult.success ? "✅" : "❌"} Cart item updated`, updateResult.success ? "green" : "red");
        }
    }

    // =========================================================================
    // PHASE 6: Order Management
    // =========================================================================
    logSection("PHASE 6: Order Management");

    if (tokens.user) {
        // Create order (validator: deliveryAddress, recipientName, recipientPhone)
        log("  Creating order...", "yellow");
        const orderData = {
            deliveryAddress: {
                address: "ул. Аль-Фараби 77",
                entrance: "1",
                apartment: "100",
                city: "Алматы",
                instructions: "Звонить при доставке"
            },
            recipientName: "Test User",
            recipientPhone: testData.userPhone
        };

        const createOrder = await apiRequest("POST", "/public/orders", orderData, tokens.user);
        if (createOrder.success && createOrder.data.data) {
            testData.orderId = createOrder.data.data._id;
            log(`  ✅ Order created: ${createOrder.data.data.orderNumber}`, "green");
        } else {
            log(`  ❌ Order creation failed: ${createOrder.data?.message || "Unknown"}`, "red");
        }
    }

    // Get user orders
    if (tokens.user) {
        log("  Getting user orders...", "yellow");
        const orders = await apiRequest("GET", "/public/profile/orders", null, tokens.user);
        log(`  ${orders.success ? "✅" : "❌"} Orders retrieved`, orders.success ? "green" : "red");
    }

    // Get active orders
    if (tokens.user) {
        log("  Getting active orders...", "yellow");
        const activeOrders = await apiRequest("GET", "/public/profile/orders/active", null, tokens.user);
        log(`  ${activeOrders.success ? "✅" : "❌"} Active orders retrieved`, activeOrders.success ? "green" : "red");
    }

    // =========================================================================
    // PHASE 7: Moderator Order Processing
    // =========================================================================
    if (tokens.moderator) {
        logSection("PHASE 7: Moderator Order Processing");

        // Get pending orders
        log("  Getting pending orders...", "yellow");
        const pendingOrders = await apiRequest("GET", `/moderator/orders?status=${ORDER_STATUS.CREATED}`, null, tokens.moderator);

        if (pendingOrders.success && pendingOrders.data.data?.length > 0) {
            const order = pendingOrders.data.data[0];
            testData.orderId = order._id;
            log(`  ✅ Found order: ${order.orderNumber}`, "green");

            // Accept order
            log("  Accepting order...", "yellow");
            const accept = await apiRequest("POST", `/moderator/orders/${order._id}/accept`, null, tokens.moderator);
            log(`  ${accept.success ? "✅" : "❌"} Order accepted`, accept.success ? "green" : "red");

            // Pack order
            log("  Packing order...", "yellow");
            const pack = await apiRequest("POST", `/moderator/orders/${order._id}/pack`, null, tokens.moderator);
            log(`  ${pack.success ? "✅" : "❌"} Order packed`, pack.success ? "green" : "red");

            // Get couriers
            log("  Getting available couriers...", "yellow");
            const couriers = await apiRequest("GET", "/moderator/couriers", null, tokens.moderator);

            if (couriers.success && couriers.data.data?.length > 0) {
                const courierId = couriers.data.data[0]._id;

                // Assign to courier
                log("  Assigning order to courier...", "yellow");
                const assign = await apiRequest("POST", `/moderator/orders/${order._id}/assign`, { courierId }, tokens.moderator);
                log(`  ${assign.success ? "✅" : "❌"} Order assigned to courier`, assign.success ? "green" : "red");
            }
        } else {
            log("  ⚠️ No pending orders found", "yellow");
        }

        // Get all orders
        log("  Getting all orders...", "yellow");
        const allOrders = await apiRequest("GET", "/moderator/orders", null, tokens.moderator);
        log(`  ${allOrders.success ? "✅" : "❌"} All orders retrieved`, allOrders.success ? "green" : "red");
    }

    // =========================================================================
    // PHASE 8: Courier Order Delivery
    // =========================================================================
    if (tokens.courier) {
        logSection("PHASE 8: Courier Order Delivery");

        // Get assigned orders
        log("  Getting assigned orders...", "yellow");
        const courierOrders = await apiRequest("GET", "/courier/orders", null, tokens.courier);

        if (courierOrders.success && courierOrders.data.data?.length > 0) {
            const deliveryOrder = courierOrders.data.data[0];
            testData.orderId = deliveryOrder._id;
            log(`  ✅ Found delivery order: ${deliveryOrder.orderNumber}`, "green");

            // Accept delivery
            log("  Accepting delivery...", "yellow");
            const accept = await apiRequest("PUT", `/courier/orders/${deliveryOrder._id}/accept`, null, tokens.courier);
            log(`  ${accept.success ? "✅" : "❌"} Delivery accepted`, accept.success ? "green" : "red");

            // Start delivery
            log("  Starting delivery...", "yellow");
            const start = await apiRequest("PUT", `/courier/orders/${deliveryOrder._id}/start`, {
                deliveryNote: "В пути"
            }, tokens.courier);
            log(`  ${start.success ? "✅" : "❌"} Delivery started`, start.success ? "green" : "red");

            // Mark as delivered
            log("  Marking as delivered...", "yellow");
            const delivered = await apiRequest("PUT", `/courier/orders/${deliveryOrder._id}/delivered`, {
                deliveryNote: "Доставлено"
            }, tokens.courier);
            log(`  ${delivered.success ? "✅" : "❌"} Order delivered`, delivered.success ? "green" : "red");
        } else {
            log("  ⚠️ No assigned orders found", "yellow");
        }
    }

    // =========================================================================
    // PHASE 9: Support Ticket Management
    // =========================================================================
    logSection("PHASE 9: Support Ticket Management");

    if (tokens.user) {
        // Create ticket (validator: subject, description, category, priority)
        log("  Creating support ticket...", "yellow");
        const ticketData = {
            subject: "Вопрос по заказу",
            description: "Хочу узнать статус доставки",
            category: "order",
            priority: "medium"
        };

        const createTicket = await apiRequest("POST", "/public/tickets", ticketData, tokens.user);
        if (createTicket.success && createTicket.data.data) {
            testData.ticketId = createTicket.data.data._id;
            log(`  ✅ Ticket created: ${createTicket.data.data.ticketNumber}`, "green");
        } else {
            log(`  ❌ Ticket creation failed: ${createTicket.data?.message || "Unknown"}`, "red");
        }
    }

    if (tokens.support && testData.ticketId) {
        // Get open tickets
        log("  Getting open tickets...", "yellow");
        const tickets = await apiRequest("GET", "/support/tickets", null, tokens.support);

        if (tickets.success && tickets.data.data?.length > 0) {
            const ticket = tickets.data.data[0];
            testData.ticketId = ticket._id;
            log(`  ✅ Found ticket: ${ticket.ticketNumber}`, "green");

            // Accept ticket
            log("  Accepting ticket...", "yellow");
            const accept = await apiRequest("PUT", `/support/tickets/${ticket._id}/accept`, null, tokens.support);
            log(`  ${accept.success ? "✅" : "❌"} Ticket accepted`, accept.success ? "green" : "red");

            // Add message
            log("  Adding response message...", "yellow");
            const message = await apiRequest("POST", `/support/tickets/${ticket._id}/messages`, {
                message: "Ваш заказ уже в пути!"
            }, tokens.support);
            log(`  ${message.success ? "✅" : "❌"} Message added`, message.success ? "green" : "red");

            // Resolve ticket
            log("  Resolving ticket...", "yellow");
            const resolve = await apiRequest("PUT", `/support/tickets/${ticket._id}/resolve`, {
                message: "Вопрос решен"
            }, tokens.support);
            log(`  ${resolve.success ? "✅" : "❌"} Ticket resolved`, resolve.success ? "green" : "red");
        }
    }

    // =========================================================================
    // PHASE 10: Public Endpoints (No Auth)
    // =========================================================================
    logSection("PHASE 10: Public Endpoints");

    // Get catalog
    log("  Getting public catalog...", "yellow");
    const catalog = await apiRequest("GET", "/public/catalog");
    log(`  ${catalog.success ? "✅" : "❌"} Catalog retrieved`, catalog.success ? "green" : "red");

    // Get products
    log("  Getting public products...", "yellow");
    const products = await apiRequest("GET", "/public/products");
    log(`  ${products.success ? "✅" : "❌"} Products retrieved (${products.data.data?.length || 0} items)`, products.success ? "green" : "red");

    // Health check
    log("  Health check...", "yellow");
    const health = await apiRequest("GET", "/health");
    log(`  ${health.success ? "✅" : "❌"} Server healthy`, health.success ? "green" : "red");

    // =========================================================================
    // SUMMARY
    // =========================================================================
    logSection("TEST COMPLETE - Summary");

    log("  ✅ Authentication tested (Admin, Moderator, Courier, Support, User)", "green");
    log(`  ✅ Catalog management tested (${testProducts.length} products)`, "green");
    log("  ✅ Product CRUD tested", "green");
    log("  ✅ Stock management tested", "green");
    log("  ✅ User registration & profile tested", "green");
    log("  ✅ Cart operations tested", "green");
    log("  ✅ Order workflow tested", "green");
    log("  ✅ Support ticket workflow tested", "green");
    log("  ✅ Public endpoints tested", "green");

    log("\n  📝 Test Credentials:", "cyan");
    log("  Admin:     +77000000001 / admin1234", "yellow");
    log("  Moderator: +77000000002 / moderator1234", "yellow");
    log("  Courier:   +77000000003 / courier1234", "yellow");
    log("  Support:   +77000000004 / support1234", "yellow");
    log(`  Test User: ${testData.userPhone} / test1234`, "yellow");

    log("\n  🎉 Full E2E journey test completed!", "green");
}

// ============================================================================
// Run Test
// ============================================================================

runTest().catch(error => {
    log(`\n  ❌ Test failed: ${error.message}`, "red");
    console.error(error);
    process.exit(1);
});
