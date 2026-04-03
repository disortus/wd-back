# Документация по базе данных WD-Back

## Обзор

Проект использует **MongoDB** в качестве базы данных с **Mongoose** в качестве ODM (Object Data Modeling). База данных содержит коллекции для пользователей, товаров, заказов, корзин, тикетов поддержки и каталога.

---

## Подключение к базе данных

### Настройка

Параметры подключения находятся в файле `.env`:

```env
MONGO_URI=mongodb://localhost:27017/wd-back
```

### Файл подключения

`config/db.js` — устанавливает соединение с MongoDB при запуске сервера.

```javascript
import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.log("❌ MongoDB connection failed", err.message);
        process.exit(1);
    }
};
```

---

## Коллекции (Collections)

### 1. Users (Пользователи)

**Название коллекции:** `users`

**Описание:** Хранит информацию о всех пользователях системы, включая клиентов и персонал.

**Схема:**

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|-----------|
| `_id` | ObjectId | Да | Уникальный идентификатор |
| `fullname` | String | Да | Полное имя пользователя |
| `passwordHash` | String | Да | Хешированный пароль |
| `phone` | String | Да | Номер телефона (уникальный) |
| `role` | String | Да | Роль пользователя |
| `isActive` | Boolean | Нет | Статус активности (по умолчанию: true) |
| `lastLogin` | Date | Нет | Дата последнего входа |
| `profile` | Object | Нет | Профиль пользователя |
| `profile.avatar` | String | Нет | Аватар |
| `profile.dateOfBirth` | Date | Нет | Дата рождения |
| `profile.gender` | String | Нет | Пол (male/female/other) |
| `profile.bio` | String | Нет | О себе |
| `addresses` | Array | Нет | Массив адресов доставки |
| `notifications` | Object | Нет | Настройки уведомлений |
| `stats` | Object | Нет | Статистика пользователя |
| `staffInfo` | Object | Нет | Информация о сотруднике |
| `createdAt` | Date | Да | Дата создания |
| `updatedAt` | Date | Да | Дата обновления |

**Индексы:**
```javascript
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ "stats.totalSpent": -1 });
```

**Пример документа:**
```javascript
{
  "_id": "507f1f77bcf86cd799439011",
  "fullname": "John Doe",
  "passwordHash": "$2b$10$...",
  "phone": "+77001234567",
  "role": "user",
  "isActive": true,
  "lastLogin": "2024-01-15T10:30:00Z",
  "profile": {
    "avatar": "",
    "dateOfBirth": null,
    "gender": "male",
    "bio": ""
  },
  "addresses": [
    {
      "label": "Home",
      "isDefault": true,
      "recipientName": "John Doe",
      "phone": "+77001234567",
      "street": "123 Main St",
      "city": "Almaty",
      "postalCode": "050000",
      "country": "Kazakhstan",
      "instructions": ""
    }
  ],
  "notifications": {
    "email": {
      "orderUpdates": true,
      "promotions": false,
      "supportUpdates": true
    },
    "sms": {
      "orderUpdates": true,
      "promotions": false
    }
  },
  "stats": {
    "totalOrders": 5,
    "totalSpent": 2500,
    "activeOrders": 1,
    "openTickets": 0
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### 2. Products (Товары)

**Название коллекции:** `products`

**Описание:** Хранит информацию о товарах в магазине.

**Схема:**

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|-----------|
| `_id` | ObjectId | Да | Уникальный идентификатор |
| `title` | String | Да | Название товара (уникальное) |
| `slug` | String | Да | URL-friendly идентификатор (уникальный) |
| `categorySlug` | String | Да | Слаг категории |
| `subcategorySlug` | String | Да | Слаг подкатегории |
| `attributes` | Map | Нет | Атрибуты товара |
| `description` | String | Нет | Описание товара |
| `price` | Number | Да | Цена товара |
| `stock` | Number | Нет | Количество на складе |
| `category_id` | ObjectId | Да | Ссылка на категорию |
| `images` | Array | Нет | Массив URL изображений |
| `specs` | Object | Нет | Технические характеристики |
| `isActive` | Boolean | Нет | Статус активности |
| `createdAt` | Date | Да | Дата создания |
| `updatedAt` | Date | Да | Дата обновления |

**Индексы:**
```javascript
productShema.index({ categorySlug: 1, subcategorySlug: 1 });
productShema.index({ title: "text", description: "text" });
productShema.index({ slug: 1 }); // уникальный
```

**Пример документа:**
```javascript
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "iPhone 15 Pro",
  "slug": "iphone-15-pro",
  "categorySlug": "electronics",
  "subcategorySlug": "smartphones",
  "attributes": {
    "color": "Space Gray",
    "storage": "256GB",
    "display": "Super Retina XDR",
    "processor": "A17 Pro",
    "battery": "3274mAh"
  },
  "description": "iPhone 15 Pro с чипом A17 Pro",
  "price": 999,
  "stock": 50,
  "category_id": "507f1f77bcf86cd799439001",
  "images": ["https://example.com/iphone15.jpg"],
  "specs": {},
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### 3. Orders (Заказы)

**Название коллекции:** `orders`

**Описание:** Хранит информацию о заказах клиентов.

**Схема:**

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|-----------|
| `_id` | ObjectId | Да | Уникальный идентификатор |
| `orderNumber` | String | Да | Уникальный номер заказа |
| `userId` | ObjectId | Да | Ссылка на пользователя |
| `userSnapshot` | Object | Да | Снимок данных пользователя |
| `items` | Array | Да | Массив товаров в заказе |
| `totalPrice` | Number | Да | Общая сумма заказа |
| `deliveryAddress` | Object | Да | Адрес доставки |
| `recipientName` | String | Да | Имя получателя |
| `recipientPhone` | String | Да | Телефон получателя |
| `status` | String | Да | Статус заказа |
| `statusHistory` | Array | Нет | История изменения статусов |
| `moderator` | ObjectId | Нет | Модератор, обрабатывающий заказ |
| `courier` | ObjectId | Нет | Курьер для доставки |
| `deliveryNote` | String | Нет | Заметка по доставке |
| `deliveredAt` | Date | Нет | Дата доставки |
| `canceledAt` | Date | Нет | Дата отмены |
| `cancelReason` | String | Нет | Причина отмены |
| `createdAt` | Date | Да | Дата создания |
| `updatedAt` | Date | Да | Дата обновления |

**Статусы заказов:**
- `created` — Заказ создан
- `accepted_by_moderator` — Принят модератором
- `packed` — Упакован
- `assigned_to_courier` — Назначен курьеру
- `in_delivery` — В доставке
- `delivered` — Доставлен
- `canceled` — Отменен

**Индексы:**
```javascript
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ moderator: 1, status: 1 });
orderSchema.index({ courier: 1, status: 1 });
orderSchema.index({ orderNumber: 1 }); // уникальный
```

**Пример документа:**
```javascript
{
  "_id": "507f1f77bcf86cd799439013",
  "orderNumber": "ORD-L5K9M2-X4A1-0001",
  "userId": "507f1f77bcf86cd799439011",
  "userSnapshot": {
    "fullname": "John Doe",
    "phone": "+77001234567"
  },
  "items": [
    {
      "product": "507f1f77bcf86cd799439012",
      "productSnapshot": {
        "title": "iPhone 15 Pro",
        "slug": "iphone-15-pro",
        "image": "https://example.com/iphone15.jpg"
      },
      "quantity": 1,
      "priceSnapshot": 999,
      "attributesSnapshot": [
        { "key": "color", "label": "Color", "value": "Space Gray" }
      ],
      "subtotal": 999
    }
  ],
  "totalPrice": 999,
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Almaty",
    "postalCode": "050000",
    "country": "Kazakhstan"
  },
  "recipientName": "John Doe",
  "recipientPhone": "+77001234567",
  "status": "in_delivery",
  "statusHistory": [
    { "status": "created", "changedAt": "2024-01-15T10:00:00Z" },
    { "status": "accepted_by_moderator", "changedAt": "2024-01-15T10:30:00Z" },
    { "status": "packed", "changedAt": "2024-01-15T11:00:00Z" },
    { "status": "assigned_to_courier", "changedAt": "2024-01-15T12:00:00Z" },
    { "status": "in_delivery", "changedAt": "2024-01-15T14:00:00Z" }
  ],
  "moderator": "507f1f77bcf86cd799439020",
  "courier": "507f1f77bcf86cd799439021",
  "deliveryNote": "",
  "deliveredAt": null,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T14:00:00Z"
}
```

---

### 4. Carts (Корзины)

**Название коллекции:** `carts`

**Описание:** Хранит информацию о корзине пользователя.

**Схема:**

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|-----------|
| `_id` | ObjectId | Да | Уникальный идентификатор |
| `user` | ObjectId | Да | Ссылка на пользователя (уникальный) |
| `items` | Array | Нет | Массив товаров |
| `totalItems` | Number | Нет | Общее количество товаров |
| `subtotal` | Number | Нет | Общая сумма |
| `createdAt` | Date | Да | Дата создания |
| `updatedAt` | Date | Да | Дата обновления |

**Индексы:**
```javascript
cartSchema.index({ user: 1 }); // уникальный
```

**Пример документа:**
```javascript
{
  "_id": "507f1f77bcf86cd799439014",
  "user": "507f1f77bcf86cd799439011",
  "items": [
    {
      "product": "507f1f77bcf86cd799439012",
      "productSnapshot": {
        "title": "iPhone 15 Pro",
        "slug": "iphone-15-pro",
        "image": "https://example.com/iphone15.jpg"
      },
      "priceSnapshot": 999,
      "attributesSnapshot": [
        { "key": "color", "label": "Color", "value": "Space Gray" }
      ],
      "quantity": 1
    }
  ],
  "totalItems": 1,
  "subtotal": 999,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

---

### 5. SupportTickets (Тикеты поддержки)

**Название коллекции:** `supporttickets`

**Описание:** Хранит обращения пользователей в службу поддержки.

**Схема:**

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|-----------|
| `_id` | ObjectId | Да | Уникальный идентификатор |
| `ticketNumber` | String | Да | Уникальный номер тикета |
| `user` | ObjectId | Да | Ссылка на пользователя |
| `userSnapshot` | Object | Да | Снимок данных пользователя |
| `subject` | String | Да | Тема тикета |
| `description` | String | Да | Описание проблемы |
| `category` | String | Нет | Категория тикета |
| `priority` | String | Нет | Приоритет |
| `status` | String | Да | Статус тикета |
| `assignedTo` | ObjectId | Нет | Назначенный агент поддержки |
| `assignedToSnapshot` | Object | Нет | Снимок данных агента |
| `assignedAt` | Date | Нет | Дата назначения |
| `messages` | Array | Нет | Массив сообщений |
| `statusHistory` | Array | Нет | История изменения статусов |
| `resolvedAt` | Date | Нет | Дата решения |
| `closedAt` | Date | Нет | Дата закрытия |
| `relatedOrder` | ObjectId | Нет | Связанный заказ |
| `rating` | Number | Нет | Оценка (1-5) |
| `feedback` | String | Нет | Отзыв |
| `createdAt` | Date | Да | Дата создания |
| `updatedAt` | Date | Да | Дата обновления |

**Категории тикетов:**
- `order` — Заказ
- `product` — Товар
- `delivery` — Доставка
- `payment` — Оплата
- `account` — Аккаунт
- `technical` — Технический
- `other` — Другое

**Приоритеты:**
- `low` — Низкий
- `medium` — Средний
- `high` — Высокий
- `urgent` — Срочный

**Статусы тикетов:**
- `open` — Открыт
- `assigned` — Назначен
- `resolved` — Решен
- `closed` — Закрыт

**Индексы:**
```javascript
ticketSchema.index({ user: 1, createdAt: -1 });
ticketSchema.index({ status: 1, assignedTo: 1 });
ticketSchema.index({ priority: 1, status: 1 });
ticketSchema.index({ category: 1, status: 1 });
ticketSchema.index({ ticketNumber: 1 }); // уникальный
```

**Пример документа:**
```javascript
{
  "_id": "507f1f77bcf86cd799439015",
  "ticketNumber": "TKT-L5K9M2-X4A1-0001",
  "user": "507f1f77bcf86cd799439011",
  "userSnapshot": {
    "fullname": "John Doe",
    "phone": "+77001234567"
  },
  "subject": "Проблема с заказом",
  "description": "Заказ не был доставлен вовремя",
  "category": "delivery",
  "priority": "high",
  "status": "resolved",
  "assignedTo": "507f1f77bcf86cd799439030",
  "assignedToSnapshot": {
    "fullname": "Support Agent",
    "phone": "+77009999999"
  },
  "assignedAt": "2024-01-15T11:00:00Z",
  "messages": [
    {
      "sender": "507f1f77bcf86cd799439011",
      "senderRole": "user",
      "senderName": "John Doe",
      "message": "Заказ не был доставлен вовремя",
      "attachments": [],
      "createdAt": "2024-01-15T10:00:00Z"
    },
    {
      "sender": "507f1f77bcf86cd799439030",
      "senderRole": "support",
      "senderName": "Support Agent",
      "message": "Мы проверили ваш заказ. Проблема решена.",
      "attachments": [],
      "createdAt": "2024-01-15T11:30:00Z"
    }
  ],
  "statusHistory": [
    { "status": "open", "changedAt": "2024-01-15T10:00:00Z" },
    { "status": "assigned", "changedAt": "2024-01-15T11:00:00Z" },
    { "status": "resolved", "changedAt": "2024-01-15T11:30:00Z" }
  ],
  "resolvedAt": "2024-01-15T11:30:00Z",
  "closedAt": null,
  "relatedOrder": "507f1f77bcf86cd799439013",
  "rating": 5,
  "feedback": "Спасибо за быструю помощь!",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T11:30:00Z"
}
```

---

### 6. Categories (Категории)

**Название коллекции:** `categories`

**Описание:** Хранит категории товаров.

**Схема:**

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|-----------|
| `_id` | ObjectId | Да | Уникальный идентификатор |
| `name` | String | Да | Название категории (уникальное) |
| `slug` | String | Да | Слаг категории (уникальный) |
| `image` | String | Нет | URL изображения |
| `isActive` | Boolean | Нет | Статус активности |
| `createdAt` | Date | Да | Дата создания |
| `updatedAt` | Date | Да | Дата обновления |

**Индексы:**
```javascript
categorySchema.index({ slug: 1 }); // уникальный
```

**Пример документа:**
```javascript
{
  "_id": "507f1f77bcf86cd799439001",
  "name": "Electronics",
  "slug": "electronics",
  "image": "https://example.com/electronics.jpg",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

### 7. Subcategories (Подкатегории)

**Название коллекции:** `subcategories`

**Описание:** Хранит подкатегории товаров.

**Схема:**

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|-----------|
| `_id` | ObjectId | Да | Уникальный идентификатор |
| `slug` | String | Да | Слаг подкатегории (уникальный) |
| `name` | String | Да | Название подкатегории |
| `categorySlug` | String | Да | Слаг родительской категории |
| `isActive` | Boolean | Нет | Статус активности |
| `createdAt` | Date | Да | Дата создания |
| `updatedAt` | Date | Да | Дата обновления |

**Индексы:**
```javascript
subcategorySchema.index({ slug: 1 }); // уникальный
subcategorySchema.index({ categorySlug: 1 });
```

**Пример документа:**
```javascript
{
  "_id": "507f1f77bcf86cd799439002",
  "slug": "smartphones",
  "name": "Smartphones",
  "categorySlug": "electronics",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

## Связи между коллекциями

```
User (userId)
    ↓
    ├── Orders (userId → User._id)
    ├── Carts (user → User._id, уникальная связь 1:1)
    └── SupportTickets (user → User._id)

Product (_id)
    ├── Order.items[].product → Product._id
    └── Cart.items[].product → Product._id

Category (_id)
    └── Product.category_id → Category._id

Order
    ├── userId → User._id
    ├── moderator → User._id (nullable)
    ├── courier → User._id (nullable)
    └── SupportTicket.relatedOrder → Order._id (nullable)

SupportTicket
    ├── user → User._id
    ├── assignedTo → User._id (nullable)
    └── relatedOrder → Order._id (nullable)
```

---

## Заполнение каталога (Seeding)

Для заполнения базы данных категориями и подкатегориями используйте команду:

```bash
npm run seed-catalog
```

Скрипт `scripts/seed-catalog.js` создает:
- 3 категории (electronics, accessories, desktops_monitors)
- 14 подкатегорий

Категории и подкатегории также определены в `src/utils/enums.js` для валидации.

---

## Рекомендации по индексированию

Текущие индексы покрывают основные запросы:

1. **Users:** Поиск по роли, активности, статистике трат
2. **Products:** Текстовый поиск, фильтрация по категориям, поиск по слагу
3. **Orders:** Фильтрация по пользователю, статусу, модератору, курьеру
4. **Carts:** Быстрый поиск по пользователю
5. **SupportTickets:** Фильтрация по пользователю, статусу, приоритету, категории
6. **Categories/Subcategories:** Поиск по слагу

Для оптимизации больших объемов данных рекомендуется:
- Добавить compound индексы для часто используемых фильтров
- Использовать TTL индексы для автоматической очистки старых логов
- Настроить шардирование для горизонтального масштабирования

---

## Резервное копирование

Для резервного копирования базы данных используйте:

```bash
# Экспорт всей базы данных
mongodump --uri="mongodb://localhost:27017/wd-back" --out=./backup

# Экспорт конкретной коллекции
mongodump --uri="mongodb://localhost:27017/wd-back" --collection=users --out=./backup

# Импорт
mongorestore --uri="mongodb://localhost:27017/wd-back" --drop ./backup
```

---

## Миграции

При изменении схемы базы данных:
1. Создайте миграционный скрипт в папке `scripts/migrations/`
2. Протестируйте на тестовой базе данных
3. Запустите миграцию перед деплоем
4. Документируйте все изменения в CHANGELOG.md