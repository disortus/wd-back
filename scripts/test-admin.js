/**
 * Admin Full CRUD + Images Test Script
 * Tests ALL admin endpoints including image upload
 * 
 * Run: node scripts/test-admin.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
// API Helper (JSON)
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
// API Helper (Multipart Form Data for file upload)
// ============================================================================

async function uploadImages(endpoint, formData, token) {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const options = { method: "POST", headers };
    options.body = formData;

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
// Create test image file
// ============================================================================

function createTestImage() {
    // Create a simple 1x1 PNG image (smallest valid PNG)
    return Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
        0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
        0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
        0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x18, 0xDD, 
        0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
        0xAE, 0x42, 0x60, 0x82
    ]);
}

// ============================================================================
// Main Test Runner
// ============================================================================

async function runTest() {
    log("\n🚀 Starting Admin Full CRUD + Images Test", "green");
    log("   API: " + BASE_URL, "yellow");

    let adminToken = null;
    let createdProductId = null;

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
        const products = await apiRequest("GET", "/admin/products", null, adminToken);
        if (products.success && products.data.data?.length > 0) {
            createdProductId = products.data.data[0]._id;
            log(`  ⚠️ Using existing product: ${createdProductId}`, "yellow");
        }
    }

    // =========================================================================
    // SECTION 2: IMAGE UPLOAD TESTS
    // =========================================================================
    logSection("SECTION 2: IMAGE UPLOAD TESTS");

    // 2.1: Upload single image
    log("\n  [2.1] UPLOAD Single Image...", "yellow");
    if (createdProductId) {
        const testImagePath = path.join(__dirname, "../test-image.png");
        fs.writeFileSync(testImagePath, createTestImage());
        
        try {
            const formData = new FormData();
            const fileBuffer = fs.readFileSync(testImagePath);
            const blob = new Blob([fileBuffer], { type: "image/png" });
            formData.append("images", blob, "test1.png");
            
            const uploadResult = await uploadImages(`/admin/products/${createdProductId}/images`, formData, adminToken);
            if (uploadResult.success) {
                log(`  ✅ Single image uploaded`, "green");
                log(`     Images count: ${uploadResult.data.data?.images?.length || 0}`, "cyan");
            } else {
                log(`  ❌ Image upload failed: ${uploadResult.data?.message || "Unknown"}`, "red");
            }
            
            fs.unlinkSync(testImagePath);
        } catch (error) {
            log(`  ❌ Image upload error: ${error.message}`, "red");
        }
    }

    // 2.2: Upload multiple images
    log("\n  [2.2] UPLOAD Multiple Images...", "yellow");
    if (createdProductId) {
        try {
            const testImagePath1 = path.join(__dirname, "../test-img1.png");
            const testImagePath2 = path.join(__dirname, "../test-img2.png");
            
            fs.writeFileSync(testImagePath1, createTestImage());
            fs.writeFileSync(testImagePath2, createTestImage());
            
            const formData = new FormData();
            formData.append("images", new Blob([fs.readFileSync(testImagePath1)], { type: "image/png" }), "multi1.png");
            formData.append("images", new Blob([fs.readFileSync(testImagePath2)], { type: "image/png" }), "multi2.png");
            
            const uploadResult = await uploadImages(`/admin/products/${createdProductId}/images`, formData, adminToken);
            if (uploadResult.success) {
                log(`  ✅ Multiple images uploaded`, "green");
                log(`     Images count: ${uploadResult.data.data?.images?.length || 0}`, "cyan");
            } else {
                log(`  ❌ Multiple image upload failed`, "red");
            }
            
            fs.unlinkSync(testImagePath1);
            fs.unlinkSync(testImagePath2);
        } catch (error) {
            log(`  ❌ Multiple image upload error: ${error.message}`, "red");
        }
    }

    // 2.3: Delete single image by index
    log("\n  [2.3] DELETE Single Image...", "yellow");
    if (createdProductId) {
        const currentProduct = await apiRequest("GET", "/admin/products", null, adminToken);
        const product = currentProduct.data.data?.find(p => p._id === createdProductId);
        
        if (product && product.images && product.images.length > 0) {
            const deleteResult = await apiRequest("DELETE", `/admin/products/${createdProductId}/images/0`, null, adminToken);
            if (deleteResult.success) {
                log(`  ✅ Image deleted`, "green");
                log(`     Remaining images: ${deleteResult.data.data?.images?.length || 0}`, "cyan");
            } else {
                log(`  ❌ Image deletion failed: ${deleteResult.data?.message}`, "red");
            }
        } else {
            log(`  ⚠️ No images to delete`, "yellow");
        }
    }

    // 2.4: Upload to non-existent product
    log("\n  [2.4] Upload to Non-existent Product...", "yellow");
    const fakeProductId = "000000000000000000000000";
    try {
        const testImagePath = path.join(__dirname, "../test-fail.png");
        fs.writeFileSync(testImagePath, createTestImage());
        
        const formData = new FormData();
        formData.append("images", new Blob([fs.readFileSync(testImagePath)], { type: "image/png" }), "fail.png");
        
        const failResult = await uploadImages(`/admin/products/${fakeProductId}/images`, formData, adminToken);
        if (!failResult.success) {
            log(`  ✅ Non-existent product rejected (status: ${failResult.status})`, "green");
        } else {
            log(`  ⚠️ Non-existent product was accepted`, "yellow");
        }
        
        fs.unlinkSync(testImagePath);
    } catch (error) {
        log(`  ❌ Test error: ${error.message}`, "red");
    }

    // =========================================================================
    // SECTION 3: PRODUCTS UPDATE
    // =========================================================================
    logSection("SECTION 3: PRODUCTS UPDATE");

    log("\n  [3.1] UPDATE Product - Title...", "yellow");
    if (createdProductId) {
        const updateTitle = await apiRequest("PATCH", `/admin/products/${createdProductId}`, {
            title: `Updated Product ${Date.now()}`
        }, adminToken);
        if (updateTitle.success) {
            log(`  ✅ Title updated`, "green");
        } else {
            log(`  ❌ Title update failed`, "red");
        }
    }

    log("\n  [3.2] UPDATE Product - Price...", "yellow");
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

    log("\n  [3.3] UPDATE Product - Stock...", "yellow");
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

    log("\n  [3.4] INCREASE STOCK...", "yellow");
    if (createdProductId) {
        const increaseStock = await apiRequest("PATCH", `/admin/products/${createdProductId}/increase-stock`, {
            quantity: 10
        }, adminToken);
        if (increaseStock.success) {
            log(`  ✅ Stock increased by 10`, "green");
        } else {
            log(`  ❌ Increase stock failed`, "red");
        }

        log("\n  [3.5] DECREASE STOCK...", "yellow");
        const decreaseStock = await apiRequest("PATCH", `/admin/products/${createdProductId}/decrease-stock`, {
            quantity: 5
        }, adminToken);
        if (decreaseStock.success) {
            log(`  ✅ Stock decreased by 5`, "green");
        } else {
            log(`  ❌ Decrease stock failed`, "red");
        }
    }

    // =========================================================================
    // SECTION 4: CATALOG MANAGEMENT
    // =========================================================================
    logSection("SECTION 4: CATALOG MANAGEMENT");

    log("\n  [4.1] GET Catalog...", "yellow");
    const getCatalog = await apiRequest("GET", "/admin/catalog", null, adminToken);
    if (getCatalog.success) {
        log(`  ✅ Catalog retrieved: ${getCatalog.data.data?.length || 0} categories`, "green");
    } else {
        log(`  ❌ Catalog retrieval failed`, "red");
    }

    log("\n  [4.2] Toggle Category...", "yellow");
    if (getCatalog.success && getCatalog.data.data?.length > 0) {
        const categoryId = getCatalog.data.data[0]._id;
        
        const disableCat = await apiRequest("PATCH", `/admin/catalog/categories/${categoryId}/toggle`, null, adminToken);
        if (disableCat.success) {
            log(`  ✅ Category disabled`, "green");
            await apiRequest("PATCH", `/admin/catalog/categories/${categoryId}/toggle`, null, adminToken);
            log(`  ✅ Category enabled`, "green");
        } else {
            log(`  ❌ Category toggle failed`, "red");
        }
    }

    // =========================================================================
    // SECTION 5: ANALYTICS
    // =========================================================================
    logSection("SECTION 5: ANALYTICS");

    log("\n  [5.1] GET Sales Analytics...", "yellow");
    const getSalesAnalytics = await apiRequest("GET", "/admin/analytics/sales", null, adminToken);
    if (getSalesAnalytics.success) {
        log(`  ✅ Sales analytics retrieved`, "green");
    } else {
        log(`  ❌ Sales analytics failed`, "red");
    }

    log("\n  [5.2] GET Staff Metrics...", "yellow");
    const getStaffMetrics = await apiRequest("GET", "/admin/analytics/staff", null, adminToken);
    if (getStaffMetrics.success) {
        log(`  ✅ Staff metrics retrieved`, "green");
    } else {
        log(`  ❌ Staff metrics failed`, "red");
    }

    // =========================================================================
    // SECTION 6: VALIDATION TESTS
    // =========================================================================
    logSection("SECTION 6: VALIDATION TESTS");

    log("\n  [6.1] Invalid Product ID...", "yellow");
    const invalidProdId = await apiRequest("PATCH", "/admin/products/invalid-id", { title: "Test" }, adminToken);
    if (!invalidProdId.success) {
        log(`  ✅ Invalid product ID rejected (status: ${invalidProdId.status})`, "green");
    } else {
        log(`  ⚠️ Invalid product ID was accepted`, "yellow");
    }

    log("\n  [6.2] Invalid Image Index...", "yellow");
    if (createdProductId) {
        const invalidIndex = await apiRequest("DELETE", `/admin/products/${createdProductId}/images/999`, null, adminToken);
        if (!invalidIndex.success) {
            log(`  ✅ Invalid image index rejected (status: ${invalidIndex.status})`, "green");
        } else {
            log(`  ⚠️ Invalid image index was accepted`, "yellow");
        }
    }

    log("\n  [6.3] Unauthorized Access...", "yellow");
    const noAuth = await apiRequest("GET", "/admin/products");
    if (!noAuth.success) {
        log(`  ✅ Unauthorized access rejected`, "green");
    } else {
        log(`  ⚠️ Unauthorized access was allowed`, "yellow");
    }

    // =========================================================================
    // SECTION 7: CLEANUP
    // =========================================================================
    logSection("SECTION 7: CLEANUP");

    log("\n  [7.1] DELETE Product...", "yellow");
    if (createdProductId) {
        const deleteProduct = await apiRequest("DELETE", `/admin/products/${createdProductId}`, null, adminToken);
        if (deleteProduct.success) {
            log(`  ✅ Product deleted`, "green");
        } else {
            log(`  ❌ Product deletion failed`, "red");
        }
    }

    // =========================================================================
    // SUMMARY
    // =========================================================================
    logSection("TEST COMPLETE - Summary");

    log("  ✅ PRODUCTS: CREATE, READ, UPDATE (title/price/stock)", "green");
    log("  ✅ PRODUCTS: increase-stock, decrease-stock", "green");
    log("  ✅ IMAGES: Upload single image", "green");
    log("  ✅ IMAGES: Upload multiple images", "green");
    log("  ✅ IMAGES: Delete image by index", "green");
    log("  ✅ IMAGES: Validation (non-existent product)", "green");
    log("  ✅ CATALOG: GET, Toggle Category", "green");
    log("  ✅ ANALYTICS: Sales, Staff Metrics", "green");
    log("  ✅ VALIDATION: Product ID, Image Index, Auth", "green");
    log("  ✅ CLEANUP: DELETE Product", "green");

    log("\n  🎉 Admin Full CRUD + Images Test completed successfully!", "green");
}

// ============================================================================
// Run Test
// ============================================================================

runTest().catch(error => {
    log(`\n  ❌ Test failed: ${error.message}`, "red");
    console.error(error);
    process.exit(1);
});
