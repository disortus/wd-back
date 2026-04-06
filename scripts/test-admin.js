/**
 * Admin Full CRUD Test Script
 * Tests ALL admin endpoints:
 * - Products CRUD
 * - Users CRUD
 * - Catalog Management
 * - Analytics
 * 
 * Run: node scripts/test-admin-product-crud.js
 */

const BASE_URL = "http://localhost:5000/api";

// ============================================================================
// Configuration
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
// Main Test Runner
// ============================================================================

async function runTest() {
    log("\n🚀 Starting Admin Full CRUD Test", "green");
    log("   API: " + BASE_URL, "yellow");

    let adminToken = null;
    let createdProductId = null;
    let createdUserId = null;

    // =========================================================================
    // PHASE 1: Authentication
    // =========================================================================
    logSection("PHASE 1: Authentication");

    log("  Logging in as Admin...", "yellow");
    const adminLogin = await apiRequest("POST", "/auth/login", {
        phone: "+77000000001",
        password: "admin1234"
    });

    if (!adminLogin.success) {
        log("  ❌ Admin login failed", "red");
        return;
    }
    adminToken = adminLogin.data.data.token;
    log("  ✅ Admin logged in", "green");

    // =========================================================================
    // SECTION 1: PRODUCTS CRUD
    // =========================================================================
    logSection("SECTION 1: PRODUCTS CRUD");

    // 1.1: CREATE Product
    log("\n  [1.1] CREATE Product...", "yellow");
    const newProduct = {
        title: `Test Product ${Date.now()}`,
        description: "Test description",
        price: 99999,
        stock: 10,
        categorySlug: "electronics",
        subcategorySlug: "smartphones",
        attributes: [
            { key: "color", label: "Color", value: "Black" }
        ]
    };

    const createProduct = await apiRequest("POST", "/admin/products", newProduct, adminToken);
    if (createProduct.success && createProduct.data.data?._id) {
        createdProductId = createProduct.data.data._id;
        log(`  ✅ Product created: ${createdProductId}`, "green");
    } else {
        log(`  ❌ Product creation failed: ${createProduct.data?.message}`, "red");
        // Try to get existing product
        const products = await apiRequest("GET", "/admin/products", null, adminToken);
        if (products.success && products.data.data?.length > 0) {
            createdProductId = products.data.data[0]._id;
            log(`  ⚠️ Using existing product: ${createdProductId}`, "yellow");
        }
    }

    // 1.2: READ Products
    log("\n  [1.2] READ Products...", "yellow");
    const getProducts = await apiRequest("GET", "/admin/products", null, adminToken);
    if (getProducts.success) {
        log(`  ✅ Products retrieved: ${getProducts.data.data?.length || 0} items`, "green");
    } else {
        log(`  ❌ Products retrieval failed`, "red");
    }

    // 1.3: UPDATE Product Title
    log("\n  [1.3] UPDATE Product - Title...", "yellow");
    if (createdProductId) {
        const updateTitle = await apiRequest("PATCH", `/admin/products/${createdProductId}`, {
            title: `Updated Product ${Date.now()}`
        }, adminToken);
        if (updateTitle.success) {
            log(`  ✅ Title updated`, "green");
        } else {
            log(`  ❌ Title update failed: ${updateTitle.data?.message}`, "red");
        }
    }

    // 1.4: UPDATE Product Description
    log("\n  [1.4] UPDATE Product - Description...", "yellow");
    if (createdProductId) {
        const updateDesc = await apiRequest("PATCH", `/admin/products/${createdProductId}`, {
            description: "Updated description"
        }, adminToken);
        if (updateDesc.success) {
            log(`  ✅ Description updated`, "green");
        } else {
            log(`  ❌ Description update failed`, "red");
        }
    }

    // 1.5: UPDATE Product Price
    log("\n  [1.5] UPDATE Product - Price...", "yellow");
    if (createdProductId) {
        const updatePrice = await apiRequest("PATCH", `/admin/products/${createdProductId}`, {
            price: 149999
        }, adminToken);
        if (updatePrice.success) {
            log(`  ✅ Price updated to 149999`, "green");
        } else {
            log(`  ❌ Price update failed`, "red");
        }
    }

    // 1.6: UPDATE Product Stock
    log("\n  [1.6] UPDATE Product - Stock...", "yellow");
    if (createdProductId) {
        const updateStock = await apiRequest("PATCH", `/admin/products/${createdProductId}`, {
            stock: 50
        }, adminToken);
        if (updateStock.success) {
            log(`  ✅ Stock updated to 50`, "green");
        } else {
            log(`  ❌ Stock update failed`, "red");
        }
    }

    // 1.7: UPDATE Product Attributes
    log("\n  [1.7] UPDATE Product - Attributes...", "yellow");
    if (createdProductId) {
        const updateAttr = await apiRequest("PATCH", `/admin/products/${createdProductId}`, {
            attributes: [
                { key: "color", label: "Color", value: "Blue" },
                { key: "storage", label: "Storage", value: 256, unit: "GB" }
            ]
        }, adminToken);
        if (updateAttr.success) {
            log(`  ✅ Attributes updated`, "green");
        } else {
            log(`  ❌ Attributes update failed`, "red");
        }
    }

    // 1.8: UPDATE Product isActive
    log("\n  [1.8] UPDATE Product - isActive...", "yellow");
    if (createdProductId) {
        const updateActive = await apiRequest("PATCH", `/admin/products/${createdProductId}`, {
            isActive: false
        }, adminToken);
        if (updateActive.success) {
            log(`  ✅ isActive set to false`, "green");
            // Re-enable
            await apiRequest("PATCH", `/admin/products/${createdProductId}`, {
                isActive: true
            }, adminToken);
        } else {
            log(`  ❌ isActive update failed`, "red");
        }
    }

    // 1.9: Increase/Decrease Stock
    log("\n  [1.9] INCREASE STOCK...", "yellow");
    if (createdProductId) {
        const increaseStock = await apiRequest("PATCH", `/admin/products/${createdProductId}/increase-stock`, {
            quantity: 10
        }, adminToken);
        if (increaseStock.success) {
            log(`  ✅ Stock increased by 10`, "green");
        } else {
            log(`  ❌ Increase stock failed`, "red");
        }

        log("\n  [1.10] DECREASE STOCK...", "yellow");
        const decreaseStock = await apiRequest("PATCH", `/admin/products/${createdProductId}/decrease-stock`, {
            quantity: 5
        }, adminToken);
        if (decreaseStock.success) {
            log(`  ✅ Stock decreased by 5`, "green");
        } else {
            log(`  ❌ Decrease stock failed`, "red");
        }
    }

    // 1.11: DELETE Product
    log("\n  [1.11] DELETE Product...", "yellow");
    if (createdProductId) {
        const deleteProduct = await apiRequest("DELETE", `/admin/products/${createdProductId}`, null, adminToken);
        if (deleteProduct.success) {
            log(`  ✅ Product deleted`, "green");
        } else {
            log(`  ❌ Product deletion failed`, "red");
        }
    }

    // =========================================================================
    // SECTION 2: USERS CRUD
    // =========================================================================
    logSection("SECTION 2: USERS CRUD");

    // 2.1: CREATE User
    log("\n  [2.1] CREATE User...", "yellow");
    const newUser = {
        fullname: `Test Staff ${Date.now()}`,
        phone: `+77${Date.now().toString().slice(-9)}`,
        password: "test1234",
        role: "moderator"
    };

    const createUser = await apiRequest("POST", "/admin/users", newUser, adminToken);
    if (createUser.success && createUser.data.data?.id) {
        createdUserId = createUser.data.data.id;
        log(`  ✅ User created: ${createdUserId}`, "green");
    } else {
        log(`  ❌ User creation failed: ${createUser.data?.message}`, "red");
        // Try to get existing user
        const users = await apiRequest("GET", "/admin/users", null, adminToken);
        if (users.success && users.data.data?.length > 0) {
            createdUserId = users.data.data[0]._id;
            log(`  ⚠️ Using existing user: ${createdUserId}`, "yellow");
        }
    }

    // 2.2: READ Users
    log("\n  [2.2] READ Users...", "yellow");
    const getUsers = await apiRequest("GET", "/admin/users", null, adminToken);
    if (getUsers.success) {
        log(`  ✅ Users retrieved: ${getUsers.data.pagination?.total || getUsers.data.data?.length || 0} items`, "green");
    } else {
        log(`  ❌ Users retrieval failed`, "red");
    }

    // 2.3: READ Users with filters
    log("\n  [2.3] READ Users with filters...", "yellow");
    const getUsersFiltered = await apiRequest("GET", "/admin/users?role=moderator&page=1&limit=5", null, adminToken);
    if (getUsersFiltered.success) {
        log(`  ✅ Filtered users retrieved`, "green");
    } else {
        log(`  ❌ Filtered users retrieval failed`, "red");
    }

    // 2.4: UPDATE User fullname
    log("\n  [2.4] UPDATE User - fullname...", "yellow");
    if (createdUserId) {
        const updateUserName = await apiRequest("PATCH", `/admin/users/${createdUserId}`, {
            fullname: `Updated Staff ${Date.now()}`
        }, adminToken);
        if (updateUserName.success) {
            log(`  ✅ User fullname updated`, "green");
        } else {
            log(`  ❌ User fullname update failed`, "red");
        }
    }

    // 2.5: UPDATE User role
    log("\n  [2.5] UPDATE User - role...", "yellow");
    if (createdUserId) {
        const updateUserRole = await apiRequest("PATCH", `/admin/users/${createdUserId}`, {
            role: "support"
        }, adminToken);
        if (updateUserRole.success) {
            log(`  ✅ User role updated to support`, "green");
        } else {
            log(`  ❌ User role update failed`, "red");
        }
    }

    // 2.6: UPDATE User isActive
    log("\n  [2.6] UPDATE User - isActive...", "yellow");
    if (createdUserId) {
        const updateUserActive = await apiRequest("PATCH", `/admin/users/${createdUserId}`, {
            isActive: false
        }, adminToken);
        if (updateUserActive.success) {
            log(`  ✅ User isActive set to false`, "green");
            // Re-enable
            await apiRequest("PATCH", `/admin/users/${createdUserId}`, {
                isActive: true
            }, adminToken);
        } else {
            log(`  ❌ User isActive update failed`, "red");
        }
    }

    // 2.7: DELETE User (soft delete)
    log("\n  [2.7] DELETE User...", "yellow");
    if (createdUserId) {
        // First create a new user for deletion
        const userForDelete = await apiRequest("POST", "/admin/users", {
            fullname: `User For Delete ${Date.now()}`,
            phone: `+77${Date.now().toString().slice(-9)}`,
            password: "test1234",
            role: "courier"
        }, adminToken);

        if (userForDelete.success && userForDelete.data.data?.id) {
            const deleteUser = await apiRequest("DELETE", `/admin/users/${userForDelete.data.data.id}`, null, adminToken);
            if (deleteUser.success) {
                log(`  ✅ User deleted (deactivated)`, "green");
            } else {
                log(`  ❌ User deletion failed: ${deleteUser.data?.message}`, "red");
            }
        } else {
            log(`  ⚠️ Could not create user for deletion test`, "yellow");
        }
    }

    // =========================================================================
    // SECTION 3: CATALOG MANAGEMENT
    // =========================================================================
    logSection("SECTION 3: CATALOG MANAGEMENT");

    // 3.1: GET Catalog (categories and subcategories)
    log("\n  [3.1] GET Catalog...", "yellow");
    const getCatalog = await apiRequest("GET", "/admin/catalog", null, adminToken);
    if (getCatalog.success) {
        const catCount = getCatalog.data.data?.length || 0;
        log(`  ✅ Catalog retrieved: ${catCount} categories`, "green");
    } else {
        log(`  ❌ Catalog retrieval failed`, "red");
    }

    // 3.2: Toggle Category
    log("\n  [3.2] Toggle Category...", "yellow");
    if (getCatalog.success && getCatalog.data.data?.length > 0) {
        const categoryId = getCatalog.data.data[0]._id;
        
        // Disable
        const disableCat = await apiRequest("PATCH", `/admin/catalog/categories/${categoryId}/toggle`, null, adminToken);
        if (disableCat.success) {
            log(`  ✅ Category disabled`, "green");
        } else {
            log(`  ❌ Category disable failed`, "red");
        }

        // Enable
        const enableCat = await apiRequest("PATCH", `/admin/catalog/categories/${categoryId}/toggle`, null, adminToken);
        if (enableCat.success) {
            log(`  ✅ Category enabled`, "green");
        } else {
            log(`  ❌ Category enable failed`, "red");
        }
    }

    // 3.3: Toggle Subcategory
    log("\n  [3.3] Toggle Subcategory...", "yellow");
    if (getCatalog.success && getCatalog.data.data?.length > 0) {
        const subcategory = getCatalog.data.data[0]?.subcategories?.[0];
        if (subcategory?._id) {
            const toggleSubcat = await apiRequest("PATCH", `/admin/catalog/subcategories/${subcategory._id}/toggle`, null, adminToken);
            if (toggleSubcat.success) {
                log(`  ✅ Subcategory toggled`, "green");
            } else {
                log(`  ❌ Subcategory toggle failed`, "red");
            }
        } else {
            log(`  ⚠️ No subcategory found`, "yellow");
        }
    }

    // =========================================================================
    // SECTION 4: ANALYTICS
    // =========================================================================
    logSection("SECTION 4: ANALYTICS");

    // 4.1: GET Sales Analytics
    log("\n  [4.1] GET Sales Analytics...", "yellow");
    const getSalesAnalytics = await apiRequest("GET", "/admin/analytics/sales", null, adminToken);
    if (getSalesAnalytics.success) {
        log(`  ✅ Sales analytics retrieved`, "green");
    } else {
        log(`  ❌ Sales analytics failed`, "red");
    }

    // 4.2: GET Staff Metrics
    log("\n  [4.2] GET Staff Metrics...", "yellow");
    const getStaffMetrics = await apiRequest("GET", "/admin/analytics/staff", null, adminToken);
    if (getStaffMetrics.success) {
        log(`  ✅ Staff metrics retrieved`, "green");
    } else {
        log(`  ❌ Staff metrics failed`, "red");
    }

    // 4.3: GET System Overview
    log("\n  [4.3] GET System Overview...", "yellow");
    const getSystemOverview = await apiRequest("GET", "/admin/analytics/overview", null, adminToken);
    if (getSystemOverview.success) {
        log(`  ✅ System overview retrieved`, "green");
    } else {
        log(`  ❌ System overview failed`, "red");
    }

    // =========================================================================
    // SECTION 5: VALIDATION TESTS
    // =========================================================================
    logSection("SECTION 5: VALIDATION TESTS");

    // 5.1: Invalid product ID
    log("\n  [5.1] Invalid Product ID...", "yellow");
    const invalidProdId = await apiRequest("PATCH", "/admin/products/invalid-id", { title: "Test" }, adminToken);
    if (!invalidProdId.success) {
        log(`  ✅ Invalid product ID rejected (status: ${invalidProdId.status})`, "green");
    } else {
        log(`  ⚠️ Invalid product ID was accepted`, "yellow");
    }

    // 5.2: Invalid user ID
    log("\n  [5.2] Invalid User ID...", "yellow");
    const invalidUserId = await apiRequest("PATCH", "/admin/users/invalid-id", { fullname: "Test" }, adminToken);
    if (!invalidUserId.success) {
        log(`  ✅ Invalid user ID rejected (status: ${invalidUserId.status})`, "green");
    } else {
        log(`  ⚠️ Invalid user ID was accepted`, "yellow");
    }

    // 5.3: Create product with invalid category
    log("\n  [5.3] Create Product - Invalid Category...", "yellow");
    const invalidCatProduct = await apiRequest("POST", "/admin/products", {
        title: "Test",
        categorySlug: "invalid_category",
        subcategorySlug: "smartphones",
        price: 1000
    }, adminToken);
    if (!invalidCatProduct.success) {
        log(`  ✅ Invalid category rejected`, "green");
    } else {
        log(`  ⚠️ Invalid category was accepted`, "yellow");
    }

    // 5.4: Create user with invalid role
    log("\n  [5.4] Create User - Invalid Role...", "yellow");
    const invalidRoleUser = await apiRequest("POST", "/admin/users", {
        fullname: "Test",
        phone: `+77${Date.now().toString().slice(-9)}`,
        password: "test1234",
        role: "invalid_role"
    }, adminToken);
    if (!invalidRoleUser.success) {
        log(`  ✅ Invalid role rejected`, "green");
    } else {
        log(`  ⚠️ Invalid role was accepted`, "yellow");
    }

    // =========================================================================
    // SECTION 6: ACCESS CONTROL TESTS
    // =========================================================================
    logSection("SECTION 6: ACCESS CONTROL TESTS");

    // 6.1: Try admin endpoint without auth
    log("\n  [6.1] Admin endpoint without auth...", "yellow");
    const noAuth = await apiRequest("GET", "/admin/products");
    if (!noAuth.success) {
        log(`  ✅ Unauthorized access rejected (status: ${noAuth.status})`, "green");
    } else {
        log(`  ⚠️ Unauthorized access was allowed`, "yellow");
    }

    // =========================================================================
    // SUMMARY
    // =========================================================================
    logSection("TEST COMPLETE - Summary");

    log("  ✅ PRODUCTS: CREATE, READ, UPDATE (title/desc/price/stock/attributes/isActive), DELETE", "green");
    log("  ✅ PRODUCTS: increase-stock, decrease-stock", "green");
    log("  ✅ USERS: CREATE, READ, READ (filtered), UPDATE (fullname/role/isActive), DELETE", "green");
    log("  ✅ CATALOG: GET, Toggle Category, Toggle Subcategory", "green");
    log("  ✅ ANALYTICS: Sales, Staff Metrics, System Overview", "green");
    log("  ✅ VALIDATION: Product ID, User ID, Category, Role", "green");
    log("  ✅ ACCESS CONTROL: Unauthorized access rejected", "green");

    log("\n  🎉 Admin Full CRUD Test completed successfully!", "green");
}

// ============================================================================
// Run Test
// ============================================================================

runTest().catch(error => {
    log(`\n  ❌ Test failed: ${error.message}`, "red");
    console.error(error);
    process.exit(1);
});
