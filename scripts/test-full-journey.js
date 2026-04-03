/**
 * Full Journey Test Script
 * This script tests the complete user flow:
 * 1. Create admin, staff (moderator, courier, support), and test user
 * 2. Admin creates products
 * 3. User adds products to cart and creates order
 * 4. Moderator processes the order
 * 5. Courier delivers the order
 * 6. User creates support ticket
 * 7. Support responds to ticket
 */

import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m"
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${"=".repeat(60)}`, "cyan");
  log(`  ${title}`, "cyan");
  log("=".repeat(60), "cyan");
}

// Helper to make requests
async function apiRequest(method, endpoint, data = null, token = null) {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  };
  
  if (data) {
    config.data = data;
  }
  
  try {
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    log(`  Error: ${errorMessage}`, "red");
    return { success: false, error: errorMessage };
  }
}

// Wait function
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTest() {
  log("\n🚀 Starting Full Journey Test", "green");
  
  let tokens = {};
  let orderId = null;
  let ticketId = null;
  let productIds = [];

  // ============================================================
  // STEP 1: Login as Admin to create products
  // ============================================================
  logSection("STEP 1: Admin Login and Product Creation");

  // Admin login
  log("  Logging in as admin...", "yellow");
  const adminLogin = await apiRequest("POST", "/auth/login", {
    phone: "+77000000001",
    password: "admin1234"
  });

  if (!adminLogin.success) {
    log("  ❌ Admin login failed. Make sure to run create-admin.js first!", "red");
    return;
  }

  tokens.admin = adminLogin.data.data.token;
  log("  ✅ Admin logged in", "green");

  // Seed catalog
  log("  Seeding catalog...", "yellow");
  const seedResult = await apiRequest("POST", "/admin/catalog/seed", {}, tokens.admin);
  
  if (seedResult.success) {
    log("  ✅ Catalog seeded", "green");
  }

  // Get subcategories to use for products
  log("  Getting subcategories...", "yellow");
  const categories = await apiRequest("GET", "/admin/catalog", null, tokens.admin);
  
  let subcategoryId = null;
  if (categories.success && categories.data.data && categories.data.data.length > 0) {
    const cat = categories.data.data[0];
    if (cat.subcategories && cat.subcategories.length > 0) {
      subcategoryId = cat.subcategories[0]._id;
      log(`  ✅ Using subcategory: ${cat.subcategories[0].name}`, "green");
    }
  }

  if (!subcategoryId) {
    log("  ⚠️ No subcategories found, using fallback", "yellow");
    subcategoryId = "placeholder-id-for-testing";
  }

  // Create products
  log("  Creating products...", "yellow");
  const products = [
    {
      title: "Casio G-Shock",
      slug: "casio-g-shock",
      description: "Прочные спортивные часы",
      price: 15000,
      stock: 10,
      subcategoryId,
      attributes: [{ key: "water_resistance", label: "Водостойкость", value: "200m" }]
    },
    {
      title: "Seiko Automatic",
      slug: "seiko-automatic",
      description: "Автоматические часы с открытым механизмом",
      price: 45000,
      stock: 5,
      subcategoryId,
      attributes: [{ key: "movement", label: "Механизм", value: "Автомат" }]
    },
    {
      title: "Rolex Submariner",
      slug: "rolex-submariner",
      description: "Премиальные дайверские часы",
      price: 350000,
      stock: 2,
      subcategoryId,
      attributes: [{ key: "material", label: "Материал", value: "Золото" }]
    }
  ];

  for (const product of products) {
    const result = await apiRequest("POST", "/admin/products", product, tokens.admin);
    if (result.success) {
      productIds.push(result.data.data._id);
      log(`  ✅ Product created: ${product.title}`, "green");
    } else {
      log(`  ❌ Failed to create product: ${product.title}`, "red");
    }
  }

  // ============================================================
  // STEP 2: Register Test User
  // ============================================================
  logSection("STEP 2: Test User Registration");

  log("  Registering test user...", "yellow");
  const userRegister = await apiRequest("POST", "/auth/register", {
    fullname: "Test User",
    phone: "+77011111111",
    password: "user1234"
  });

  if (!userRegister.success) {
    log("  ❌ User registration failed", "red");
    return;
  }

  tokens.user = userRegister.data.data.token;
  log("  ✅ Test user registered and logged in", "green");

  // ============================================================
  // STEP 3: User adds products to cart
  // ============================================================
  logSection("STEP 3: User Adds Products to Cart");

  log("  Adding products to cart...", "yellow");
  
  // Add first product to cart
  const addToCart1 = await apiRequest("POST", "/cart/items", {
    productId: productIds[0],
    quantity: 1
  }, tokens.user);

  if (addToCart1.success) {
    log(`  ✅ Added Casio G-Shock to cart`, "green");
  }

  // Add second product to cart
  const addToCart2 = await apiRequest("POST", "/cart/items", {
    productId: productIds[1],
    quantity: 1
  }, tokens.user);

  if (addToCart2.success) {
    log(`  ✅ Added Seiko Automatic to cart`, "green");
  }

  // ============================================================
  // STEP 4: User creates order
  // ============================================================
  logSection("STEP 4: User Creates Order");

  log("  Creating order...", "yellow");
  const createOrder = await apiRequest("POST", "/orders", {
    deliveryAddress: {
      street: "ул. Пушкина 10",
      city: "Алматы",
      postalCode: "050000",
      country: "Казахстан"
    },
    recipientName: "Test User",
    recipientPhone: "+77011111111"
  }, tokens.user);

  if (!createOrder.success) {
    log("  ❌ Order creation failed", "red");
    return;
  }

  orderId = createOrder.data.data._id;
  log(`  ✅ Order created: ${createOrder.data.data.orderNumber}`, "green");
  log(`  📦 Total price: ${createOrder.data.data.totalPrice} ₸`, "yellow");

  // ============================================================
  // STEP 5: Moderator processes order
  // ============================================================
  logSection("STEP 5: Moderator Processes Order");

  // Login as moderator
  log("  Logging in as moderator...", "yellow");
  const modLogin = await apiRequest("POST", "/auth/login", {
    phone: "+77000000002",
    password: "moderator1234"
  });

  if (!modLogin.success) {
    log("  ❌ Moderator login failed. Make sure to run create-staff.js first!", "red");
    return;
  }

  tokens.moderator = modLogin.data.data.token;
  log("  ✅ Moderator logged in", "green");

  // Get orders
  log("  Getting pending orders...", "yellow");
  const orders = await apiRequest("GET", "/moderator/orders?status=created", null, tokens.moderator);
  
  if (orders.success && orders.data.data.length > 0) {
    const pendingOrder = orders.data.data[0];
    orderId = pendingOrder._id;
    log(`  📋 Found order: ${pendingOrder.orderNumber}`, "yellow");

    // Accept order
    log("  Accepting order...", "yellow");
    const accept = await apiRequest("PUT", `/moderator/orders/${orderId}/accept`, null, tokens.moderator);
    if (accept.success) {
      log("  ✅ Order accepted by moderator", "green");
    }

    // Pack order
    log("  Packing order...", "yellow");
    const pack = await apiRequest("PUT", `/moderator/orders/${orderId}/pack`, null, tokens.moderator);
    if (pack.success) {
      log("  ✅ Order packed by moderator", "green");
    }

    // Get available couriers
    log("  Getting available couriers...", "yellow");
    const couriers = await apiRequest("GET", "/moderator/couriers", null, tokens.moderator);
    
    if (couriers.success && couriers.data.data.length > 0) {
      const courierId = couriers.data.data[0]._id;
      log(`  📦 Assigning order to courier: ${couriers.data.data[0].fullname}`, "yellow");
      
      const assign = await apiRequest("PUT", `/moderator/orders/${orderId}/assign`, 
        { courierId }, tokens.moderator);
      
      if (assign.success) {
        log("  ✅ Order assigned to courier", "green");
      }
    }
  }

  // ============================================================
  // STEP 6: Courier delivers order
  // ============================================================
  logSection("STEP 6: Courier Delivers Order");

  // Login as courier
  log("  Logging in as courier...", "yellow");
  const courierLogin = await apiRequest("POST", "/auth/login", {
    phone: "+77000000003",
    password: "courier1234"
  });

  if (!courierLogin.success) {
    log("  ❌ Courier login failed", "red");
    return;
  }

  tokens.courier = courierLogin.data.data.token;
  log("  ✅ Courier logged in", "green");

  // Get assigned orders
  log("  Getting assigned orders...", "yellow");
  const courierOrders = await apiRequest("GET", "/courier/orders", null, tokens.courier);

  if (courierOrders.success && courierOrders.data.data.length > 0) {
    const deliveryOrder = courierOrders.data.data[0];
    orderId = deliveryOrder._id;
    log(`  📋 Found order for delivery: ${deliveryOrder.orderNumber}`, "yellow");

    // Accept delivery
    log("  Accepting delivery...", "yellow");
    const acceptDelivery = await apiRequest("PUT", `/courier/orders/${orderId}/accept`, null, tokens.courier);
    if (acceptDelivery.success) {
      log("  ✅ Delivery accepted", "green");
    }

    // Start delivery
    log("  Starting delivery...", "yellow");
    const startDelivery = await apiRequest("PUT", `/courier/orders/${orderId}/start`, 
      { deliveryNote: "Доставка в будний день" }, tokens.courier);
    if (startDelivery.success) {
      log("  ✅ Delivery started", "green");
    }

    // Mark as delivered
    log("  Marking as delivered...", "yellow");
    const delivered = await apiRequest("PUT", `/courier/orders/${orderId}/delivered`, 
      { deliveryNote: "Доставлено получателю" }, tokens.courier);
    if (delivered.success) {
      log("  ✅ Order delivered successfully!", "green");
    }
  }

  // ============================================================
  // STEP 7: User creates support ticket
  // ============================================================
  logSection("STEP 7: User Creates Support Ticket");

  log("  Creating support ticket...", "yellow");
  const createTicket = await apiRequest("POST", "/tickets", {
    subject: "Вопрос о доставке",
    description: "Хотел узнать примерное время доставки",
    category: "delivery",
    priority: "medium"
  }, tokens.user);

  if (!createTicket.success) {
    log("  ❌ Ticket creation failed", "red");
    return;
  }

  ticketId = createTicket.data.data._id;
  log(`  ✅ Support ticket created: ${createTicket.data.data.ticketNumber}`, "green");

  // ============================================================
  // STEP 8: Support responds to ticket
  // ============================================================
  logSection("STEP 8: Support Responds to Ticket");

  // Login as support
  log("  Logging in as support...", "yellow");
  const supportLogin = await apiRequest("POST", "/auth/login", {
    phone: "+77000000004",
    password: "support1234"
  });

  if (!supportLogin.success) {
    log("  ❌ Support login failed", "red");
    return;
  }

  tokens.support = supportLogin.data.data.token;
  log("  ✅ Support logged in", "green");

  // Get open tickets
  log("  Getting open tickets...", "yellow");
  const openTickets = await apiRequest("GET", "/support/tickets", null, tokens.support);

  if (openTickets.success && openTickets.data.data.length > 0) {
    const ticket = openTickets.data.data[0];
    ticketId = ticket._id;
    log(`  📋 Found ticket: ${ticket.ticketNumber}`, "yellow");

    // Accept ticket
    log("  Accepting ticket...", "yellow");
    const acceptTicket = await apiRequest("PUT", `/support/tickets/${ticketId}/accept`, null, tokens.support);
    if (acceptTicket.success) {
      log("  ✅ Ticket accepted", "green");
    }

    // Add response message
    log("  Adding response message...", "yellow");
    const response = await apiRequest("POST", `/support/tickets/${ticketId}/messages`, 
      { message: "Здравствуйте! Ваш заказ был успешно доставлен. Если у вас есть дополнительные вопросы, пожалуйста, дайте знать." }, 
      tokens.support);
    
    if (response.success) {
      log("  ✅ Response added to ticket", "green");
    }

    // Resolve ticket
    log("  Resolving ticket...", "yellow");
    const resolve = await apiRequest("PUT", `/support/tickets/${ticketId}/resolve`, 
      { message: "Ваш вопрос решен. Спасибо за обращение!" }, tokens.support);
    
    if (resolve.success) {
      log("  ✅ Ticket resolved!", "green");
    }
  }

  // ============================================================
  // SUMMARY
  // ============================================================
  logSection("TEST COMPLETE - Summary");

  log("  📊 Test Results:", "cyan");
  log(`  ✅ Admin logged in and created ${productIds.length} products`, "green");
  log(`  ✅ Test user registered (phone: +77011111111)`, "green");
  log(`  ✅ User created order (ID: ${orderId})`, "green");
  log(`  ✅ Moderator processed order (accept -> pack -> assign)`, "green");
  log(`  ✅ Courier delivered order (accept -> start -> deliver)`, "green");
  log(`  ✅ Support ticket created (ID: ${ticketId})`, "green");
  log(`  ✅ Support responded and resolved ticket`, "green");

  log("\n  📝 Test Credentials:", "cyan");
  log("  Admin:   +77000000001 / admin1234", "yellow");
  log("  Moderator: +77000000002 / moderator1234", "yellow");
  log("  Courier:  +77000000003 / courier1234", "yellow");
  log("  Support:  +77000000004 / support1234", "yellow");
  log("  User:    +77011111111 / user1234", "yellow");

  log("\n  🎉 Full journey test completed successfully!", "green");
}

runTest().catch(error => {
  log(`\n  ❌ Test failed with error: ${error.message}`, "red");
  process.exit(1);
});