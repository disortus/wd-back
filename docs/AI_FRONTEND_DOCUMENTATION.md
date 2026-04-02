# API Documentation for Frontend AI Assistant

## Overview

This is an **Apple Store Backend API** (`wd-back`) - an e-commerce platform for Apple-style products with role-based order management, support tickets, and a complete catalog system.

**Base URL:** `http://localhost:5000/api`
**Documentation:** `http://localhost:5000/docs` (Swagger UI)
**Auth Method:** JWT Bearer Token (sent in `Authorization: Bearer <token>` header)

---

## Project Architecture

### Technology Stack
- **Runtime:** Node.js with ES Modules
- **Framework:** Express.js v5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Security:** helmet, cors, rate-limiting

### User Roles (enum)
| Role | Description |
|------|-------------|
| `user` | Regular customer |
| `admin` | Full system access |
| `moderator` | Order processing (accept, pack, assign to courier) |
| `courier` | Delivery management |
| `support` | Support ticket handling |

---

## API Endpoints Summary

### 🔓 Public Routes (No Auth Required)

#### Health Check
```
GET /api/health
Response: { ok: true, uptime: number }
```

#### Home Page Data
```
GET /api/public/
Response: { ok: true, data: { hero, featuredCategories, newArrivals, popularProducts, advantages } }
```

#### Catalog
```
GET /api/public/catalog/tree
Response: { ok: true, data: { [categorySlug]: { name, subcategories: { [subSlug]: { name, attributes } } } } }
```

#### Products
```
GET /api/public/products
Query: ?category=electronics&subcategory=smartphones&minPrice=100&maxPrice=1000&search=iPhone&page=1&limit=10
Response: { ok: true, data: [Product], total, page, pages }

GET /api/public/products/:slug
Response: { ok: true, data: Product }
```

---

### 🔐 Auth Routes

#### Register
```
POST /api/auth/register
Body: { fullname: string, email: string, password: string, phone?: string }
Response: { ok: true, data: { user: { id, fullname, email, role }, token } }
Rate Limit: 20 requests per 15 minutes
```

#### Login
```
POST /api/auth/login
Body: { email: string, password: string }
Response: { ok: true, data: { user: { id, fullname, email, role }, token } }
Rate Limit: 20 requests per 15 minutes
```

#### Get Current User
```
GET /api/auth/me
Auth: Bearer Token
Response: { ok: true, data: User }
```

---

### 🛒 Cart Routes (Auth Required)

#### Get Cart
```
GET /api/public/cart
Response: { ok: true, data: { user, items: [...], totalItems, subtotal } }
```

#### Add to Cart
```
POST /api/public/cart
Body: { productId: string, quantity?: number, attributes?: [{ key: string, value: any }] }
Response: { ok: true, data: Cart }
Note: Attributes must match subcategory schema
```

#### Update Cart Item Quantity
```
PATCH /api/public/cart/:productId
Body: { quantity: number }
Response: { ok: true, data: Cart }
```

#### Remove from Cart
```
DELETE /api/public/cart/:productId?attributes=JSON
Response: { ok: true, data: Cart }
```

#### Clear Cart
```
DELETE /api/public/cart
Response: { ok: true, data: Cart }
```

---

### 📦 Order Routes (Auth Required)

#### Create Order (from cart)
```
POST /api/public/orders
Body: {
  deliveryAddress: { street, city, postalCode, country },
  recipientName: string,
  recipientPhone: string
}
Response: { ok: true, data: Order }
Side Effects: Cart cleared, stock decremented, user stats updated
```

#### Get My Orders
```
GET /api/public/orders?page=1&limit=10&status=created
Response: { ok: true, data: [Order], pagination: { page, limit, total, pages } }
```

#### Get Single Order
```
GET /api/public/orders/:id
Response: { ok: true, data: Order }
```

#### Cancel Order
```
POST /api/public/orders/:id/cancel
Body: { reason?: string }
Response: { ok: true, data: Order }
Note: Cannot cancel if status is "in_delivery" or "delivered"
```

---

### 🎫 Support Ticket Routes (Auth Required)

#### Create Ticket
```
POST /api/public/tickets
Body: {
  subject: string,
  description: string,
  category?: "order"|"product"|"delivery"|"payment"|"account"|"technical"|"other",
  priority?: "low"|"medium"|"high"|"urgent",
  relatedOrderId?: string
}
Response: { ok: true, data: Ticket }
```

#### Get My Tickets
```
GET /api/public/tickets?page=1&limit=10&status=open
Response: { ok: true, data: [Ticket], pagination }
```

#### Get Single Ticket
```
GET /api/public/tickets/:id
Response: { ok: true, data: Ticket }
```

#### Add Message to Ticket
```
POST /api/public/tickets/:id/messages
Body: { message: string, attachments?: [string] }
Response: { ok: true, data: Ticket }
```

#### Rate Ticket
```
POST /api/public/tickets/:id/rate
Body: { rating: 1-5, feedback?: string }
Response: { ok: true, data: Ticket }
Note: Only for resolved/closed tickets
```

---

### 👤 Profile Routes (Auth Required)

#### Get My Profile
```
GET /api/public/profile/me
Response: { ok: true, data: User (full profile with addresses, notifications) }
```

#### Update My Profile
```
PATCH /api/public/profile/me
Body: { fullname?, phone?, profile?: {...}, addresses?: [...], notifications?: {...} }
Response: { ok: true, data: User }
```

#### Get Order History
```
GET /api/public/profile/orders?page=1&limit=10
Response: { ok: true, data: [Order], pagination }
```

#### Get Active Orders
```
GET /api/public/profile/orders/active
Response: { ok: true, data: [Order] }
Note: Returns orders with status in ["created", "accepted_by_moderator", "packed", "assigned_to_courier", "in_delivery"]
```

#### Get Order Tracking
```
GET /api/public/profile/orders/:orderId/tracking
Response: { ok: true, data: { orderNumber, status, statusHistory, items, totalPrice, deliveryAddress, recipientName, recipientPhone, moderator, courier, deliveryNote, createdAt, updatedAt } }
```

#### Get My Tickets (via profile)
```
GET /api/public/profile/tickets?page=1&limit=10
Response: { ok: true, data: [Ticket], pagination }
```

#### Manage Addresses
```
POST /api/public/profile/addresses        - Add address
PATCH /api/public/profile/addresses/:addressId  - Update address
DELETE /api/public/profile/addresses/:addressId  - Delete address
Body: { label?, recipientName, phone, street, city, postalCode, country, instructions?, isDefault? }
Response: { ok: true, data: [Address] }
```

#### Get User Stats
```
GET /api/public/profile/stats
Response: { ok: true, data: { totalOrders, activeOrders, totalSpent, totalTickets, openTickets } }
```

---

### 👨‍💼 Admin Routes (Admin Role Required)

#### User Management
```
GET /api/admin/users/stats
Response: { ok: true, data: { totalUsers, activeUsers, usersByRole: {...}, recentUsers } }

GET /api/admin/users/role/:role
Response: { ok: true, data: [User] }

GET /api/admin/users?page=1&limit=20&role=moderator&search=john
Response: { ok: true, data: [User], pagination }

GET /api/admin/users/:id
Response: { ok: true, data: User }

POST /api/admin/users
Body: { fullname, email, password, role, phone }
Response: { ok: true, data: { id, fullname, email, role, createdAt } }

PATCH /api/admin/users/:id
Body: { fullname?, phone?, role?, isActive?, staffInfo? }
Response: { ok: true, data: User }

PATCH /api/admin/users/:id/toggle
Response: { ok: true, data: { id, fullname, email, role, isActive } }

DELETE /api/admin/users/:id
Response: { ok: true, message: "User deactivated successfully" }
```

#### Catalog Management
```
GET /api/admin/catalog/structure
Response: { ok: true, data: { categories, subcategories, attributes } }

GET /api/admin/catalog
Response: { ok: true, data: [{ _id, name, slug, image, isActive, subcategories }] }

POST /api/admin/catalog/seed
Response: { ok: true, message: "Catalog seeded successfully", data: { categoriesCreated, subcategoriesCreated } }

PATCH /api/admin/catalog/categories/:id/toggle
Response: { ok: true, data: Category }
Note: Also toggles all subcategories

PATCH /api/admin/catalog/subcategories/:id/toggle
Response: { ok: true, data: Subcategory }
```

#### Product Management
```
GET /api/admin/products
Response: { ok: true, data: [Product] }

POST /api/admin/products
Body: {
  title: string,
  categorySlug: "electronics"|"accessories"|"desktops_monitors",
  subcategorySlug: string,
  attributes: object,
  description?: string,
  price: number,
  stock?: number,
  images?: [string]
}
Response: { ok: true, data: Product }

PATCH /api/admin/products/:id
Body: { title?, price?, stock?, attributes?, description?, images? }
Response: { ok: true, data: Product }

DELETE /api/admin/products/:id
Response: { ok: true }
```

---

### ⚖️ Moderator Routes (Moderator/Admin Role)

#### Order Management
```
GET /api/moderator/orders?page=1&limit=20&status=created
Response: { ok: true, data: [Order], pagination }
Default: Shows orders with status in [created, accepted_by_moderator, packed]

GET /api/moderator/orders/stats
Response: { ok: true, data: { totalOrders, ordersByStatus: {...}, totalRevenue, recentOrders } }

GET /api/moderator/couriers
Response: { ok: true, data: [User] }

GET /api/moderator/orders/:id
Response: { ok: true, data: Order }

POST /api/moderator/orders/:id/accept
Response: { ok: true, data: Order }
Note: Assigns order to moderator, changes status to "accepted_by_moderator"

POST /api/moderator/orders/:id/pack
Response: { ok: true, data: Order }
Note: Changes status to "packed", only assigned moderator can pack

POST /api/moderator/orders/:id/assign
Body: { courierId: string }
Response: { ok: true, data: Order }
Note: Changes status to "assigned_to_courier"

POST /api/moderator/orders/:id/cancel
Body: { reason?: string }
Response: { ok: true, data: Order }
Note: Restores stock, updates user stats
```

---

### 🚴 Courier Routes (Courier/Admin Role)

#### Delivery Management
```
GET /api/courier/orders
Response: { ok: true, data: [Order], pagination }
Note: Shows orders assigned to this courier

GET /api/courier/orders/available
Response: { ok: true, data: [Order], pagination }
Note: Shows orders with status "assigned_to_courier" and no courier assigned

GET /api/courier/orders/stats
Response: { ok: true, data: { totalDelivered, inDelivery, pending, totalEarnings } }

GET /api/courier/orders/:id
Response: { ok: true, data: Order }

POST /api/courier/orders/:id/accept
Response: { ok: true, data: Order }
Note: Assigns courier to order

POST /api/courier/orders/:id/start
Body: { deliveryNote?: string }
Response: { ok: true, data: Order }
Note: Changes status to "in_delivery"

POST /api/courier/orders/:id/delivered
Body: { deliveryNote?: string }
Response: { ok: true, data: Order }
Note: Changes status to "delivered", sets deliveredAt

PATCH /api/courier/orders/:id/status
Body: { status: "assigned_to_courier"|"in_delivery"|"delivered", deliveryNote?: string }
Response: { ok: true, data: Order }
```

---

### 🎧 Support Routes (Support/Admin Role)

#### Ticket Management
```
GET /api/support/tickets
Response: { ok: true, data: [Ticket], pagination }
Note: Shows tickets assigned to this support agent

GET /api/support/tickets/open
Query: ?page=1&limit=20&priority=high&category=order
Response: { ok: true, data: [Ticket], pagination }
Note: Shows all open tickets (high priority first)

GET /api/support/tickets/stats
Response: { ok: true, data: { open, myAssigned, myResolved, myClosed, avgResolutionTimeMs } }

GET /api/support/tickets/:id
Response: { ok: true, data: Ticket }

POST /api/support/tickets/:id/accept
Response: { ok: true, data: Ticket }
Note: Assigns ticket to support agent, changes status to "assigned"

POST /api/support/tickets/:id/release
Response: { ok: true, data: Ticket }
Note: Releases assignment, status back to "open"

POST /api/support/tickets/:id/message
Body: { message: string, attachments?: [string] }
Response: { ok: true, data: Ticket }

POST /api/support/tickets/:id/resolve
Body: { message?: string }
Response: { ok: true, data: Ticket }
Note: Changes status to "resolved"

POST /api/support/tickets/:id/close
Body: { message?: string }
Response: { ok: true, data: Ticket }
Note: Changes status to "closed"

POST /api/support/tickets/:id/reopen
Body: { reason?: string }
Response: { ok: true, data: Ticket }
Note: Only for resolved tickets, status to "assigned"
```

---

## Data Models

### User
```javascript
{
  _id: ObjectId,
  fullname: string,
  email: string,
  passwordHash: string,
  phone: string,
  role: "user"|"admin"|"moderator"|"courier"|"support"|"developer",
  isActive: boolean,
  lastLogin: Date,
  profile: {
    avatar: string,
    dateOfBirth: Date,
    gender: "male"|"female"|"other"|"",
    bio: string
  },
  addresses: [{
    label: string,
    isDefault: boolean,
    recipientName: string,
    phone: string,
    street: string,
    city: string,
    postalCode: string,
    country: string,
    instructions: string
  }],
  notifications: {
    email: { orderUpdates, promotions, supportUpdates },
    sms: { orderUpdates, promotions }
  },
  stats: {
    totalOrders: number,
    totalSpent: number,
    activeOrders: number,
    openTickets: number
  },
  staffInfo: {
    department: string,
    employeeId: string,
    hireDate: Date,
    permissions: [string]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  title: string,
  slug: string,
  categorySlug: "electronics"|"accessories"|"desktops_monitors",
  subcategorySlug: string,
  attributes: { [key]: value },
  description: string,
  price: number,
  stock: number,
  category_id: ObjectId,
  images: [string],
  specs: object,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  orderNumber: "ORD-XXXX-XXXX-0001",
  userId: ObjectId,
  userSnapshot: { fullname, email, phone },
  items: [{
    product: ObjectId,
    productSnapshot: { title, slug, image },
    quantity: number,
    priceSnapshot: number,
    attributesSnapshot: [{ key, label, value, unit }],
    subtotal: number
  }],
  totalPrice: number,
  deliveryAddress: { street, city, postalCode, country },
  recipientName: string,
  recipientPhone: string,
  status: "created"|"accepted_by_moderator"|"packed"|"assigned_to_courier"|"in_delivery"|"delivered"|"canceled",
  statusHistory: [{ status, changedAt, changedBy, note }],
  moderator: ObjectId,
  courier: ObjectId,
  deliveryNote: string,
  deliveredAt: Date,
  canceledAt: Date,
  cancelReason: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  items: [{
    product: ObjectId,
    productSnapshot: { title, slug, image },
    priceSnapshot: number,
    attributesSnapshot: [{ key, label, value, unit }],
    quantity: number
  }],
  totalItems: number,
  subtotal: number,
  createdAt: Date,
  updatedAt: Date
}
```

### SupportTicket
```javascript
{
  _id: ObjectId,
  ticketNumber: "TKT-XXXX-XXXX-0001",
  user: ObjectId,
  userSnapshot: { fullname, email, phone },
  subject: string,
  description: string,
  category: "order"|"product"|"delivery"|"payment"|"account"|"technical"|"other",
  priority: "low"|"medium"|"high"|"urgent",
  status: "open"|"assigned"|"resolved"|"closed",
  assignedTo: ObjectId,
  assignedToSnapshot: { fullname, email },
  assignedAt: Date,
  messages: [{
    sender: ObjectId,
    senderRole: string,
    senderName: string,
    message: string,
    attachments: [string],
    createdAt: Date
  }],
  statusHistory: [{ status, changedAt, changedBy, note }],
  resolvedAt: Date,
  closedAt: Date,
  relatedOrder: ObjectId,
  rating: 1-5,
  feedback: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Category
```javascript
{
  _id: ObjectId,
  name: string,
  slug: "electronics"|"accessories"|"desktops_monitors",
  image: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Subcategory
```javascript
{
  _id: ObjectId,
  slug: string,
  name: string,
  categorySlug: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Order Status Flow
```
created → accepted_by_moderator → packed → assigned_to_courier → in_delivery → delivered
                                      ↓
                                  canceled

User can cancel at: created, accepted_by_moderator, packed
User CANNOT cancel at: assigned_to_courier, in_delivery, delivered
```

## Ticket Status Flow
```
open → assigned → resolved → closed
         ↓
     reopened → assigned
```

---

## Category/Subcategory Structure
Categories and their subcategories are defined in `src/utils/enums.js`:

**electronics:**
- smartphones, laptops, tablets, smart_watches, headphones, desktops

**accessories:**
- chargers, cables, cases, adapters, keyboards, mice, apple_pencil, hubs_docks

**desktops_monitors:**
- desktops, monitors

---

## Product Attributes by Subcategory

Each subcategory has specific attributes (defined in enums.js). Example for smartphones:
- display, display_size, processor, battery, storage, ram
- camera_main, camera_front, sim_type, color, weight, water_resistance

---

## Response Format

### Success Response
```json
{
  "ok": true,
  "data": { ... }
}
```

### Success with Pagination
```json
{
  "ok": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "ok": false,
  "message": "Error description"
}
```

### Validation Error
```json
{
  "ok": false,
  "message": "validation failed",
  "details": "invalid data format",
  "errors": [{ "field": "email", "message": "invalid email format" }]
}
```

---

## Authentication Flow

1. User registers `/api/auth/register` or logs in `/api/auth/login`
2. Server returns JWT token
3. Frontend stores token (localStorage/cookie)
4. All protected requests include header: `Authorization: Bearer <token>`
5. Token payload: `{ id: userId, role: userRole }`

---

## Rate Limiting

- **Auth endpoints:** 20 requests per 15 minutes
- **All other endpoints:** 300 requests per 15 minutes

---

## Notes for Frontend Development

1. **Stock Management:** Always check stock before adding to cart
2. **Price Snapshots:** Order items store price at time of order creation
3. **User Stats:** Updated automatically on order creation/cancellation
4. **Address Management:** Support for multiple addresses with default flag
5. **Ticket Categories:** Can link tickets to specific orders via `relatedOrderId`
6. **Product Attributes:** Must match subcategory schema (defined in enums)
7. **Order Cancellation:** User cannot cancel once "in_delivery" status
8. **Ticket Messaging:** Both user and support can add messages
9. **Swagger Docs:** Available at `/docs` for interactive API testing

---

## Common Frontend Use Cases

### Add to Cart with Attributes
```javascript
// Example: Add iPhone with color attribute
POST /api/public/cart
{
  productId: "...",
  quantity: 1,
  attributes: [{ key: "color", value: "Space Gray" }]
}
```

### Create Order
```javascript
// First ensure cart has items, then
POST /api/public/orders
{
  deliveryAddress: {
    street: "123 Main St",
    city: "Almaty",
    postalCode: "050000",
    country: "Kazakhstan"
  },
  recipientName: "John Doe",
  recipientPhone: "+77001234567"
}
```

### Order Status Display
```javascript
const STATUS_LABELS = {
  created: "Order Created",
  accepted_by_moderator: "Accepted by Moderator",
  packed: "Packed",
  assigned_to_courier: "Assigned to Courier",
  in_delivery: "In Delivery",
  delivered: "Delivered",
  canceled: "Canceled"
};
```

### Ticket Priority Levels
```javascript
const PRIORITY_LEVELS = ["low", "medium", "high", "urgent"];
```
