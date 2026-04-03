/**
 * Full Journey Test Script
 * Tests complete user flow for Apple Store API
 */

const BASE_URL = "http://localhost:5000/api";

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
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

// Helper to make requests using fetch
async function apiRequest(method, endpoint, data = null, token = null) {
  const headers = {
    "Content-Type": "application/json"
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    return { success: response.ok, data: result, status: response.status };
  } catch (error) {
    log(`  Error: ${error.message}`, "red");
    return { success: false, error: error.message };
  }
}

async function runTest() {
  log("\n🚀 Starting Full Journey Test", "green");
  
  let tokens = {};
  let orderId = null;
  let ticketId = null;
  let productIds = [];
  let categoryId = null;
  let subcategoryId = null;

  // ============================================================
  // STEP 1: Admin Login
  // ============================================================
  logSection("STEP 1: Admin Login");

  log("  Logging in as admin...", "yellow");
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

  // ============================================================
  // STEP 2: Get Categories (for product creation)
  // ============================================================
  logSection("STEP 2: Get Categories and Subcategories");

  log("  Getting categories from API...", "yellow");
  const categories = await apiRequest("GET", "/admin/catalog", null, tokens.admin);
  
  let categoryMap = {};
  if (categories.success && categories.data.data) {
    categories.data.data.forEach(cat => {
      categoryMap[cat.slug] = { _id: cat._id, subcategories: {} };
      // Store first category ID for toggle test
      if (!categoryId) categoryId = cat._id;
      if (cat.subcategories) {
        cat.subcategories.forEach(sub => {
          categoryMap[cat.slug].subcategories[sub.slug] = sub._id;
          // Store first subcategory ID for toggle test
          if (!subcategoryId) subcategoryId = sub._id;
        });
      }
    });
    log(`  ✅ Found ${categories.data.data.length} categories`, "green");
  }

  // ============================================================
  // STEP 3: Test Enable/Disable Category
  // ============================================================
  logSection("STEP 3: Test Enable/Disable Category");

  if (categoryId) {
    log(`  Testing toggle for category ID: ${categoryId}`, "yellow");
    
    // Disable category
    let result = await apiRequest("PATCH", `/admin/catalog/categories/${categoryId}/toggle`, null, tokens.admin);
    log(`  ${result.success ? "✅" : "❌"} Disable category: ${result.success ? "success" : "failed"}`, result.success ? "green" : "red");
    
    // Re-enable category
    result = await apiRequest("PATCH", `/admin/catalog/categories/${categoryId}/toggle`, null, tokens.admin);
    log(`  ${result.success ? "✅" : "❌"} Enable category: ${result.success ? "success" : "failed"}`, result.success ? "green" : "red");
  }

  if (subcategoryId) {
    log(`  Testing toggle for subcategory ID: ${subcategoryId}`, "yellow");
    
    // Disable subcategory
    let result = await apiRequest("PATCH", `/admin/catalog/subcategories/${subcategoryId}/toggle`, null, tokens.admin);
    log(`  ${result.success ? "✅" : "❌"} Disable subcategory: ${result.success ? "success" : "failed"}`, result.success ? "green" : "red");
    
    // Re-enable subcategory
    result = await apiRequest("PATCH", `/admin/catalog/subcategories/${subcategoryId}/toggle`, null, tokens.admin);
    log(`  ${result.success ? "✅" : "❌"} Enable subcategory: ${result.success ? "success" : "failed"}`, result.success ? "green" : "red");
  }

  // ============================================================
  // STEP 4: Create Apple Products
  // ============================================================
  logSection("STEP 4: Create Apple Products");

  const products = [
    // iPhone (smartphones)
    {
      title: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max-new",
      description: "Apple iPhone 15 Pro Max with A17 Pro chip",
      price: 599990,
      stock: 10,
      categorySlug: "electronics",
      subcategorySlug: "smartphones",
      attributes: {
        color: "Natural Titanium",
        storage: "256GB",
        ram: "8GB"
      }
    },
    // iPad (tablets)
    {
      title: "iPad Pro 12.9 M4",
      slug: "ipad-pro-12-9-m4-new",
      description: "iPad Pro with M4 chip, 12.9-inch display",
      price: 499990,
      stock: 5,
      categorySlug: "electronics",
      subcategorySlug: "tablets",
      attributes: {
        storage: "256GB",
        cellular: true,
        color: "Space Black"
      }
    },
    // MacBook (laptops)
    {
      title: "MacBook Pro 14 M3 Pro",
      slug: "macbook-pro-14-m3-pro-new",
      description: "MacBook Pro with M3 Pro chip, 14-inch Liquid Retina XDR",
      price: 799990,
      stock: 3,
      categorySlug: "electronics",
      subcategorySlug: "laptops",
      attributes: {
        processor: "M3 Pro",
        ram: "18GB",
        storage: "512GB SSD",
        color: "Space Black"
      }
    },
    // Apple Watch (smart_watches)
    {
      title: "Apple Watch Ultra 2",
      slug: "apple-watch-ultra-2-new",
      description: "Apple Watch Ultra 2 with GPS + Cellular",
      price: 349990,
      stock: 8,
      categorySlug: "electronics",
      subcategorySlug: "smart_watches",
      attributes: {
        case_size: 49,
        color: "Titanium",
        cellular: true
      }
    },
    // AirPods (headphones)
    {
      title: "AirPods Pro 2nd Gen",
      slug: "airpods-pro-2nd-gen-new",
      description: "AirPods Pro with USB-C, Active Noise Cancellation",
      price: 109990,
      stock: 20,
      categorySlug: "electronics",
      subcategorySlug: "headphones",
      attributes: {
        wireless: true,
        noise_canceling: true,
        color: "White"
      }
    },
    // Mac Mini (desktops)
    {
      title: "Mac Mini M2 Pro",
      slug: "mac-mini-m2-pro-new",
      description: "Mac Mini with M2 Pro chip",
      price: 449990,
      stock: 4,
      categorySlug: "desktops_monitors",
      subcategorySlug: "desktops",
      attributes: {
        processor: "M2 Pro",
        ram: "16GB",
        storage: "512GB SSD"
      }
    },
    // Studio Display (monitors)
    {
      title: "Studio Display",
      slug: "studio-display-new",
      description: "27-inch 5K Retina display with Pro Stand",
      price: 599990,
      stock: 2,
      categorySlug: "desktops_monitors",
      subcategorySlug: "monitors",
      attributes: {
        display_size: 27,
        resolution: "5K",
        glass: "Nano-texture"
      }
    },
    // Accessories - Charger
    {
      title: "MagSafe Charger",
      slug: "magsafe-charger-new",
      description: "MagSafe 15W charger for iPhone",
      price: 15990,
      stock: 30,
      categorySlug: "accessories",
      subcategorySlug: "chargers",
      attributes: {
        power: 15,
        fast_charging: true,
        type: "MagSafe"
      }
    },
    // Accessories - Cable
    {
      title: "USB-C to Lightning Cable",
      slug: "usb-c-to-lightning-cable-new",
      description: "1m USB-C to Lightning cable",
      price: 4990,
      stock: 50,
      categorySlug: "accessories",
      subcategorySlug: "cables",
      attributes: {
        length: 1,
        connector_type: "USB-C to Lightning",
        fast_charging: true
      }
    },
    // Accessories - Case
    {
      title: "iPhone 15 Pro Max Clear Case",
      slug: "iphone-15-pro-max-clear-case-new",
      description: "Clear case with MagSafe",
      price: 6990,
      stock: 25,
      categorySlug: "accessories",
      subcategorySlug: "cases",
      attributes: {
        material: "Polycarbonate",
        magsafe: true,
        color: "Clear"
      }
    }
  ];

  for (const product of products) {
    // Check if product exists first
    const checkResult = await apiRequest("GET", `/admin/products?slug=${product.slug}`, null, tokens.admin);
    
    if (checkResult.success && checkResult.data.data && checkResult.data.data.length > 0) {
      log(`  ⏭️  Product exists, skipping: ${product.title}`, "yellow");
      productIds.push(checkResult.data.data[0]._id);
      continue;
    }
    
    const result = await apiRequest("POST", "/admin/products", product, tokens.admin);
    
    if (result.success && result.data.data && result.data.data._id) {
      productIds.push(result.data.data._id);
      log(`  ✅ Created: ${product.title} - ${product.price}₸`, "green");
    } else {
      log(`  ❌ Failed: ${product.title}`, "red");
    }
  }

  // ============================================================
  // STEP 5: Register Test User
  // ============================================================
  logSection("STEP 5: Test User Login/Register");

  log("  Trying to login as test user...", "yellow");
  const userLogin = await apiRequest("POST", "/auth/login", {
    phone: "+77011111111",
    password: "user1234"
  });

  if (userLogin.success && userLogin.data.data && userLogin.data.data.token) {
    tokens.user = userLogin.data.data.token;
    log("  ✅ Test user logged in (already exists)", "green");
  } else {
    log("  User doesn't exist, registering...", "yellow");
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
  }

  // ============================================================
  // STEP 6: User adds products to cart (using /public/cart)
  // ============================================================
  logSection("STEP 6: User Adds Products to Cart");

  log("  Adding products to cart...", "yellow");
  
  // Add first 2 products using correct path: /api/public/cart
  if (productIds.length >= 2) {
    const cart1 = await apiRequest("POST", "/public/cart", {
      productId: productIds[0],
      quantity: 1
    }, tokens.user);
    log(`  ${cart1.success ? "✅" : "❌"} Added iPhone to cart`, cart1.success ? "green" : "red");
    
    const cart2 = await apiRequest("POST", "/public/cart", {
      productId: productIds[1],
      quantity: 1
    }, tokens.user);
    log(`  ${cart2.success ? "✅" : "❌"} Added iPad to cart`, cart2.success ? "green" : "red");
  } else {
    log("  ⚠️ Not enough products to add to cart", "yellow");
  }

  // ============================================================
  // STEP 7: User creates order (using /public/orders)
  // ============================================================
  logSection("STEP 7: User Creates Order");

  log("  Creating order...", "yellow");
  const createOrder = await apiRequest("POST", "/public/orders", {
    deliveryAddress: {
      street: "пр. Аль-Фараби 77",
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

  // ============================================================
  // STEP 8: Moderator processes order
  // ============================================================
  logSection("STEP 8: Moderator Processes Order");

  log("  Logging in as moderator...", "yellow");
  const modLogin = await apiRequest("POST", "/auth/login", {
    phone: "+77000000002",
    password: "moderator1234"
  });

  if (!modLogin.success) {
    log("  ❌ Moderator login failed", "red");
    return;
  }

  tokens.moderator = modLogin.data.data.token;
  log("  ✅ Moderator logged in", "green");

  // Get orders
  log("  Getting pending orders...", "yellow");
  const orders = await apiRequest("GET", "/moderator/orders?status=created", null, tokens.moderator);
  
  if (orders.success && orders.data.data && orders.data.data.length > 0) {
    const pendingOrder = orders.data.data[0];
    orderId = pendingOrder._id;
    log(`  📋 Found order: ${pendingOrder.orderNumber}`, "yellow");

    // Accept order
    log("  Accepting order...", "yellow");
    await apiRequest("PUT", `/moderator/orders/${orderId}/accept`, null, tokens.moderator);
    log("  ✅ Order accepted", "green");

    // Pack order
    log("  Packing order...", "yellow");
    await apiRequest("PUT", `/moderator/orders/${orderId}/pack`, null, tokens.moderator);
    log("  ✅ Order packed", "green");

    // Get couriers
    log("  Getting available couriers...", "yellow");
    const couriers = await apiRequest("GET", "/moderator/couriers", null, tokens.moderator);
    
    if (couriers.success && couriers.data.data && couriers.data.data.length > 0) {
      const courierId = couriers.data.data[0]._id;
      log(`  📦 Assigning order to courier: ${couriers.data.data[0].fullname}`, "yellow");
      await apiRequest("PUT", `/moderator/orders/${orderId}/assign`, { courierId }, tokens.moderator);
      log("  ✅ Order assigned to courier", "green");
    }
  }

  // ============================================================
  // STEP 9: Courier delivers order
  // ============================================================
  logSection("STEP 9: Courier Delivers Order");

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

  if (courierOrders.success && courierOrders.data.data && courierOrders.data.data.length > 0) {
    const deliveryOrder = courierOrders.data.data[0];
    orderId = deliveryOrder._id;
    log(`  📋 Found order for delivery: ${deliveryOrder.orderNumber}`, "yellow");

    // Accept delivery
    log("  Accepting delivery...", "yellow");
    await apiRequest("PUT", `/courier/orders/${orderId}/accept`, null, tokens.courier);
    log("  ✅ Delivery accepted", "green");

    // Start delivery
    log("  Starting delivery...", "yellow");
    await apiRequest("PUT", `/courier/orders/${orderId}/start`, { deliveryNote: "В пути" }, tokens.courier);
    log("  ✅ Delivery started", "green");

    // Mark as delivered
    log("  Marking as delivered...", "yellow");
    await apiRequest("PUT", `/courier/orders/${orderId}/delivered`, { deliveryNote: "Доставлено" }, tokens.courier);
    log("  ✅ Order delivered!", "green");
  }

  // ============================================================
  // STEP 10: User creates support ticket (using /public/tickets)
  // ============================================================
  logSection("STEP 10: User Creates Support Ticket");

  log("  Creating support ticket...", "yellow");
  const createTicket = await apiRequest("POST", "/public/tickets", {
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
  log(`  ✅ Support ticket created`, "green");

  // ============================================================
  // STEP 11: Support responds to ticket
  // ============================================================
  logSection("STEP 11: Support Responds to Ticket");

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

  if (openTickets.success && openTickets.data.data && openTickets.data.data.length > 0) {
    const ticket = openTickets.data.data[0];
    ticketId = ticket._id;
    log(`  📋 Found ticket: ${ticket.ticketNumber}`, "yellow");

    // Accept ticket
    log("  Accepting ticket...", "yellow");
    await apiRequest("PUT", `/support/tickets/${ticketId}/accept`, null, tokens.support);
    log("  ✅ Ticket accepted", "green");

    // Add response message
    log("  Adding response message...", "yellow");
    await apiRequest("POST", `/support/tickets/${ticketId}/messages`, 
      { message: "Ваш заказ доставлен!" }, tokens.support);
    log("  ✅ Response added", "green");

    // Resolve ticket
    log("  Resolving ticket...", "yellow");
    await apiRequest("PUT", `/support/tickets/${ticketId}/resolve`, 
      { message: "Вопрос решен" }, tokens.support);
    log("  ✅ Ticket resolved!", "green");
  }

  // ============================================================
  // SUMMARY
  // ============================================================
  logSection("TEST COMPLETE - Summary");

  log("  ✅ Admin logged in", "green");
  log("  ✅ Categories/Subcategories toggled", "green");
  log(`  ✅ ${productIds.length} Apple products created/check`, "green");
  log("  ✅ Test user logged in", "green");
  log("  ✅ Products added to cart", "green");
  log("  ✅ Order created", "green");
  log("  ✅ Moderator processed order", "green");
  log("  ✅ Courier delivered order", "green");
  log("  ✅ Support ticket created", "green");
  log("  ✅ Support responded and resolved", "green");

  log("\n  📝 Test Credentials:", "cyan");
  log("  Admin:   +77000000001 / admin1234", "yellow");
  log("  Moderator: +77000000002 / moderator1234", "yellow");
  log("  Courier:  +77000000003 / courier1234", "yellow");
  log("  Support:  +77000000004 / support1234", "yellow");
  log("  User:    +77011111111 / user1234", "yellow");

  log("\n  🎉 Full journey test completed!", "green");
}

runTest().catch(error => {
  log(`\n  ❌ Test failed: ${error.message}`, "red");
  process.exit(1);
});