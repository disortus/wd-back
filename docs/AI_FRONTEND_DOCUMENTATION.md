# API Documentation для Frontend AI Assistant

## Обзор

Это **Apple Store Backend API** (`wd-back`) — платформа электронной коммерции для продуктов Apple-стиля с управлением заказами на основе ролей, тикетами поддержки и полной системой каталога.

**Base URL:** `http://localhost:5000/api`  
**Документация:** `http://localhost:5000/docs` (Swagger UI)  
**Метод аутентификации:** JWT Bearer Token (в заголовке `Authorization: Bearer <token>`)

---

## Архитектура проекта

### Технологический стек

- **Runtime:** Node.js с ES Modules
- **Framework:** Express.js v5
- **База данных:** MongoDB с Mongoose ODM
- **Аутентификация:** JWT (jsonwebtoken)
- **Валидация:** express-validator
- **Безопасность:** helmet, cors, rate-limiting

### Роли пользователей

| Роль | Описание |
|------|----------|
| `user` | Обычный покупатель |
| `admin` | Полный доступ к системе |
| `moderator` | Обработка заказов (принять, упаковать, назначить курьера) |
| `courier` | Управление доставкой |
| `support` | Обработка тикетов поддержки |

---

## Сводка API Endpoints

### 🔓 Публичные маршруты (без авторизации)

#### Health Check
```
GET /api/health
Response: { ok: true, uptime: number }
```

#### Данные главной страницы
```
GET /api/public/
Response: { ok: true, data: { hero, featuredCategories, newArrivals, popularProducts, advantages } }
```

#### Каталог
```
GET /api/public/catalog/tree
Response: { ok: true, data: { [categorySlug]: { name, subcategories: { [subSlug]: { name, attributes } } } } }
```

#### Товары
```
GET /api/public/products
Query: ?category=electronics&subcategory=smartphones&minPrice=100&maxPrice=1000&search=iPhone&page=1&limit=10
Response: { ok: true, data: [Product], total, page, pages }

GET /api/public/products/:slug
Response: { ok: true, data: Product }
```

---

### 🔐 Маршруты аутентификации

#### Регистрация
```
POST /api/auth/register
Body: { fullname: string, phone: string, password: string }
Response: { ok: true, data: { user: { id, fullname, phone, role }, token } }
Rate Limit: 20 requests per 15 minutes
```

#### Вход
```
POST /api/auth/login
Body: { phone: string, password: string }
Response: { ok: true, data: { user: { id, fullname, phone, role }, token } }
Rate Limit: 20 requests per 15 minutes
```

#### Получить текущего пользователя
```
GET /api/auth/me
Auth: Bearer Token
Response: { ok: true, data: User }
```

---

### 🛒 Маршруты корзины (требуется авторизация)

#### Получить корзину
```
GET /api/public/cart
Response: { ok: true, data: { user, items: [...], totalItems, subtotal } }
```

#### Добавить в корзину
```
POST /api/public/cart
Body: { productId: string, quantity?: number, attributes?: [{ key: string, value: any }] }
Response: { ok: true, data: Cart }
Note: Атрибуты должны соответствовать схеме подкатегории
```

#### Обновить количество товара в корзине
```
PATCH /api/public/cart/:productId
Body: { quantity: number }
Response: { ok: true, data: Cart }
```

#### Удалить из корзины
```
DELETE /api/public/cart/:productId?attributes=JSON
Response: { ok: true, data: Cart }
```

#### Очистить корзину
```
DELETE /api/public/cart
Response: { ok: true, data: Cart }
```

---

### 📦 Маршруты заказов (требуется авторизация)

#### Создать заказ (из корзины)
```
POST /api/public/orders
Body: {
  deliveryAddress: { street, city, postalCode, country },
  recipientName: string,
  recipientPhone: string
}
Response: { ok: true, data: Order }
Side Effects: Корзина очищена, остаток уменьшен, статистика пользователя обновлена
```

#### Получить мои заказы
```
GET /api/public/orders?page=1&limit=10&status=created
Response: { ok: true, data: [Order], pagination: { page, limit, total, pages } }
```

#### Получить один заказ
```
GET /api/public/orders/:id
Response: { ok: true, data: Order }
```

#### Отменить заказ
```
POST /api/public/orders/:id/cancel
Body: { reason?: string }
Response: { ok: true, data: Order }
Note: Нельзя отменить если статус "in_delivery" или "delivered"
```

---

### 🎫 Маршруты тикетов поддержки (требуется авторизация)

#### Создать тикет
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

#### Получить мои тикеты
```
GET /api/public/tickets?page=1&limit=10&status=open
Response: { ok: true, data: [Ticket], pagination }
```

#### Получить один тикет
```
GET /api/public/tickets/:id
Response: { ok: true, data: Ticket }
```

#### Добавить сообщение к тикету
```
POST /api/public/tickets/:id/messages
Body: { message: string, attachments?: [string] }
Response: { ok: true, data: Ticket }
```

#### Оценить тикет
```
POST /api/public/tickets/:id/rate
Body: { rating: 1-5, feedback?: string }
Response: { ok: true, data: Ticket }
Note: Только для resolved/closed тикетов
```

---

### 👤 Маршруты профиля (требуется авторизация)

#### Получить мой профиль
```
GET /api/public/profile/me
Response: { ok: true, data: User (полный профиль с адресами, уведомлениями) }
```

#### Обновить мой профиль
```
PATCH /api/public/profile/me
Body: { fullname?, phone?, profile?: {...}, addresses?: [...], notifications?: {...} }
Response: { ok: true, data: User }
```

#### Получить историю заказов
```
GET /api/public/profile/orders?page=1&limit=10
Response: { ok: true, data: [Order], pagination }
```

#### Получить активные заказы
```
GET /api/public/profile/orders/active
Response: { ok: true, data: [Order] }
Note: Возвращает заказы со статусами ["created", "accepted_by_moderator", "packed", "assigned_to_courier", "in_delivery"]
```

#### Получить отслеживание заказа
```
GET /api/public/profile/orders/:orderId/tracking
Response: { ok: true, data: { orderNumber, status, statusHistory, items, totalPrice, deliveryAddress, recipientName, recipientPhone, moderator, courier, deliveryNote, createdAt, updatedAt } }
```

#### Получить мои тикеты (через профиль)
```
GET /api/public/profile/tickets?page=1&limit=10
Response: { ok: true, data: [Ticket], pagination }
```

#### Управление адресами
```
POST /api/public/profile/addresses        - Добавить адрес
PATCH /api/public/profile/addresses/:addressId  - Обновить адрес
DELETE /api/public/profile/addresses/:addressId  - Удалить адрес
Body: { label?, recipientName, phone, street, city, postalCode, country, instructions?, isDefault? }
Response: { ok: true, data: [Address] }
```

#### Получить статистику пользователя
```
GET /api/public/profile/stats
Response: { ok: true, data: { totalOrders, activeOrders, totalSpent, totalTickets, openTickets } }
```

---

### 👨‍💼 Маршруты администратора (требуется роль: admin)

#### Управление пользователями
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
Body: { fullname, phone, password, role, phone }
Response: { ok: true, data: { id, fullname, phone, role, createdAt } }

PATCH /api/admin/users/:id
Body: { fullname?, phone?, role?, isActive?, staffInfo? }
Response: { ok: true, data: User }

PATCH /api/admin/users/:id/toggle
Response: { ok: true, data: { id, fullname, phone, role, isActive } }

DELETE /api/admin/users/:id
Response: { ok: true, message: "User deactivated successfully" }
```

#### Управление каталогом
```
GET /api/admin/catalog/structure
Response: { ok: true, data: { categories, subcategories, attributes } }

GET /api/admin/catalog
Response: { ok: true, data: [{ _id, name, slug, image, isActive, subcategories }] }

POST /api/admin/catalog/seed
Response: { ok: true, message: "Catalog seeded successfully", data: { categoriesCreated, subcategoriesCreated } }

PATCH /api/admin/catalog/categories/:id/toggle
Response: { ok: true, data: Category }
Note: Также переключает все подкатегории

PATCH /api/admin/catalog/subcategories/:id/toggle
Response: { ok: true, data: Subcategory }
```

#### Управление товарами
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

### ⚖️ Маршруты модератора (требуется роль: moderator/admin)

#### Управление заказами
```
GET /api/moderator/orders?page=1&limit=20&status=created
Response: { ok: true, data: [Order], pagination }
Default: Показывает заказы со статусами [created, accepted_by_moderator, packed]

GET /api/moderator/orders/stats
Response: { ok: true, data: { totalOrders, ordersByStatus: {...}, totalRevenue, recentOrders } }

GET /api/moderator/couriers
Response: { ok: true, data: [User] }

GET /api/moderator/orders/:id
Response: { ok: true, data: Order }

POST /api/moderator/orders/:id/accept
Response: { ok: true, data: Order }
Note: Назначает заказ модератору, меняет статус на "accepted_by_moderator"

POST /api/moderator/orders/:id/pack
Response: { ok: true, data: Order }
Note: Меняет статус на "packed", только назначенный модератор может упаковать

POST /api/moderator/orders/:id/assign
Body: { courierId: string }
Response: { ok: true, data: Order }
Note: Меняет статус на "assigned_to_courier"

POST /api/moderator/orders/:id/cancel
Body: { reason?: string }
Response: { ok: true, data: Order }
Note: Восстанавливает остаток, обновляет статистику пользователя
```

---

### 🚴 Маршруты курьера (требуется роль: courier/admin)

#### Управление доставкой
```
GET /api/courier/orders
Response: { ok: true, data: [Order], pagination }
Note: Показывает заказы назначенные этому курьеру

GET /api/courier/orders/available
Response: { ok: true, data: [Order], pagination }
Note: Показывает заказы со статусом "assigned_to_courier" без назначенного курьера

GET /api/courier/orders/stats
Response: { ok: true, data: { totalDelivered, inDelivery, pending, totalEarnings } }

GET /api/courier/orders/:id
Response: { ok: true, data: Order }

POST /api/courier/orders/:id/accept
Response: { ok: true, data: Order }
Note: Назначает курьера на заказ

POST /api/courier/orders/:id/start
Body: { deliveryNote?: string }
Response: { ok: true, data: Order }
Note: Меняет статус на "in_delivery"

POST /api/courier/orders/:id/delivered
Body: { deliveryNote?: string }
Response: { ok: true, data: Order }
Note: Меняет статус на "delivered", устанавливает deliveredAt

PATCH /api/courier/orders/:id/status
Body: { status: "assigned_to_courier"|"in_delivery"|"delivered", deliveryNote?: string }
Response: { ok: true, data: Order }
```

---

### 🎧 Маршруты поддержки (требуется роль: support/admin)

#### Управление тикетами
```
GET /api/support/tickets
Response: { ok: true, data: [Ticket], pagination }
Note: Показывает тикеты назначенные этому агенту поддержки

GET /api/support/tickets/open
Query: ?page=1&limit=20&priority=high&category=order
Response: { ok: true, data: [Ticket], pagination }
Note: Показывает все открытые тикеты (высокий приоритет первым)

GET /api/support/tickets/archived
Query: ?page=1&limit=20&status=resolved|closed
Response: { ok: true, data: [Ticket], pagination }
Note: Архив тикетов саппорта (resolved/closed), включая закрытые чаты

GET /api/support/tickets/stats
Response: { ok: true, data: { open, myAssigned, myResolved, myClosed, avgResolutionTimeMs } }

GET /api/support/tickets/:id
Response: { ok: true, data: Ticket }

GET /api/support/tickets/:id/messages
Response: { ok: true, data: { ticketId, ticketNumber, status, assignedTo, messages, updatedAt } }
Note: Доступен для любых статусов, включая closed

POST /api/support/tickets/:id/accept
Response: { ok: true, data: Ticket }
Note: Назначает тикет агенту поддержки, меняет статус на "assigned"

POST /api/support/tickets/:id/release
Response: { ok: true, data: Ticket }
Note: Освобождает назначение, статус обратно "open"

POST /api/support/tickets/:id/reject
Body: { reason?: string }
Response: { ok: true, data: Ticket }
Note: Для назначенного агента; возвращает тикет в "open" с сохранением истории переписки

POST /api/support/tickets/:id/message
Body: { message: string, attachments?: [string] }
Response: { ok: true, data: Ticket }

POST /api/support/tickets/:id/resolve
Body: { message?: string }
Response: { ok: true, data: Ticket }
Note: Меняет статус на "resolved"

POST /api/support/tickets/:id/close
Body: { message?: string }
Response: { ok: true, data: Ticket }
Note: Меняет статус на "closed"

POST /api/support/tickets/:id/reopen
Body: { reason?: string }
Response: { ok: true, data: Ticket }
Note: Только для resolved тикетов, статус на "assigned"
```

---

## Модели данных

### User
```javascript
{
  _id: ObjectId,
  fullname: string,
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
  userSnapshot: { fullname, phone },
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
  userSnapshot: { fullname, phone },
  subject: string,
  description: string,
  category: "order"|"product"|"delivery"|"payment"|"account"|"technical"|"other",
  priority: "low"|"medium"|"high"|"urgent",
  status: "open"|"assigned"|"resolved"|"closed",
  assignedTo: ObjectId,
  assignedToSnapshot: { fullname, phone },
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

## Поток статусов заказов

```
created → accepted_by_moderator → packed → assigned_to_courier → in_delivery → delivered
                                      ↓
                                  canceled

Пользователь может отменить: created, accepted_by_moderator, packed
Пользователь НЕ может отменить: assigned_to_courier, in_delivery, delivered
```

## Поток статусов тикетов

```
open → assigned → resolved → closed
         ↓
     reopened → assigned
```

---

## Структура категорий/подкатегорий

Категории и их подкатегории определены в `src/utils/enums.js`:

**electronics:**
- smartphones, laptops, tablets, smart_watches, headphones, desktops

**accessories:**
- chargers, cables, cases, adapters, keyboards, mice, apple_pencil, hubs_docks

**desktops_monitors:**
- desktops, monitors

---

## Атрибуты товаров по подкатегориям

Каждая подкатегория имеет определенные атрибуты (определены в enums.js). Пример для smartphones:
- display, display_size, processor, battery, storage, ram
- camera_main, camera_front, sim_type, color, weight, water_resistance

---

## Формат ответа

### Успешный ответ
```json
{
  "ok": true,
  "data": { ... }
}
```

### Успешный ответ с пагинацией
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

### Ошибка
```json
{
  "ok": false,
  "message": "Error description"
}
```

### Ошибка валидации
```json
{
  "ok": false,
  "message": "validation failed",
  "details": "invalid data format",
  "errors": [{ "field": "email", "message": "invalid email format" }]
}
```

---

## Поток аутентификации

1. Пользователь регистрируется `/api/auth/register` или входит `/api/auth/login`
2. Сервер возвращает JWT токен
3. Фронтенд сохраняет токен (localStorage/cookie)
4. Все защищенные запросы включают заголовок: `Authorization: Bearer <token>`
5. Токен payload: `{ id: userId, role: userRole }`

---

## Rate Limiting

- **Эндпоинты аутентификации:** 20 запросов за 15 минут
- **Все остальные эндпоинты:** 300 запросов за 15 минут

---

## Заметки для Frontend разработки

1. **Управление остатками:** Всегда проверяйте остаток перед добавлением в корзину
2. **Снимки цен:** Товары заказа сохраняют цену на момент создания заказа
3. **Статистика пользователя:** Обновляется автоматически при создании/отмене заказа
4. **Управление адресами:** Поддержка нескольких адресов с флагом по умолчанию
5. **Категории тикетов:** Можно связать тикеты с конкретными заказами через `relatedOrderId`
6. **Атрибуты товаров:** Должны соответствовать схеме подкатегории (определено в enums)
7. **Отмена заказа:** Пользователь не может отменить после статуса "in_delivery"
8. **Сообщения тикетов:** Пользователь и поддержка могут добавлять сообщения
9. **Swagger Docs:** Доступен на `/docs` для интерактивного тестирования API

---

## Частые случаи использования Frontend

### Добавить в корзину с атрибутами
```javascript
// Пример: Добавить iPhone с атрибутом цвета
POST /api/public/cart
{
  productId: "...",
  quantity: 1,
  attributes: [{ key: "color", value: "Space Gray" }]
}
```

### Создать заказ
```javascript
// Сначала убедитесь что в корзине есть товары, затем
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

### Отображение статуса заказа
```javascript
const STATUS_LABELS = {
  created: "Заказ создан",
  accepted_by_moderator: "Принят модератором",
  packed: "Упакован",
  assigned_to_courier: "Назначен курьеру",
  in_delivery: "В доставке",
  delivered: "Доставлен",
  canceled: "Отменен"
};
```

### Уровни приоритета тикетов
```javascript
const PRIORITY_LEVELS = ["low", "medium", "high", "urgent"];