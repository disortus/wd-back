# FRONTEND DOCUMENTATION — WD-Back API

**Версия API:** 1.1.0  
**Базовый URL:** `http://localhost:5000/api`

---

## 📡 Общая информация

### Формат ответов

Все эндпоинты возвращают JSON в следующем формате:

**Успешный ответ:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Ответ с ошибкой валидации:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "title too short" }
  ]
}
```

**Ответ с ошибкой сервера:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

### Аутентификация

Для авторизованных запросов добавьте заголовок:
```
Authorization: Bearer <token>
```

Токен получается при логине в `/auth/login`.

---

## 📂 Публичные эндпоинты (без авторизации)

### Главная страница
```
GET /public/
```
Возвращает: hero данные, категории, популярные товары.

### Каталог
```
GET /public/catalog/tree
```
Возвращает иерархию категорий с подкатегориями.

### Товары
```
GET /public/products
```
Query параметры:
- `category` - фильтр по категории
- `subcategory` - фильтр по подкатегории
- `minPrice` / `maxPrice` - диапазон цен
- `page` / `limit` - пагинация
- `search` - поиск по названию

```
GET /public/products/:slug
```
Получить товар по слагу.

---

## 🔐 Авторизация

### Регистрация
```
POST /auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "phone": "+77001234567",
  "password": "password123"
}
```

### Вход
```
POST /auth/login
Content-Type: application/json

{
  "phone": "+77001234567",
  "password": "password123"
}
```
**Ответ:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
}
```

### Текущий пользователь
```
GET /auth/me
Authorization: Bearer <token>
```

---

## 🛒 Корзина (требует авторизации)

### Получить корзину
```
GET /public/cart
Authorization: Bearer <token>
```

### Добавить товар
```
POST /public/cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439012",
  "quantity": 1,
  "attributes": [
    { "key": "color", "value": "Space Gray" }
  ]
}
```

### Изменить количество
```
PATCH /public/cart/items/:itemId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

### Удалить товар
```
DELETE /public/cart/items/:itemId
Authorization: Bearer <token>
```

### Очистить корзину
```
DELETE /public/cart
Authorization: Bearer <token>
```

---

## 📦 Заказы (требует авторизации)

### Создать заказ
```
POST /public/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientName": "John Doe",
  "recipientPhone": "+77001234567",
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Almaty",
    "postalCode": "050000",
    "country": "Kazakhstan"
  },
  "deliveryNote": "Call upon arrival"
}
```

### Мои заказы
```
GET /public/orders
Authorization: Bearer <token>
```

### Детали заказа
```
GET /public/orders/:id
Authorization: Bearer <token>
```

### Отменить заказ
```
POST /public/orders/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```
**Примечание:** Нельзя отменить заказ, если он уже у курьера или в доставке.

---

## 👤 Профиль (требует авторизации)

### Мой профиль
```
GET /public/profile/me
Authorization: Bearer <token>
```

### Обновить профиль
```
PATCH /public/profile/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullname": "John Doe",
  "profile": {
    "dateOfBirth": "1990-01-15",
    "gender": "male"
  }
}
```

### История заказов
```
GET /public/profile/orders
Authorization: Bearer <token>
```

### Активные заказы
```
GET /public/profile/orders/active
Authorization: Bearer <token>
```

### Отслеживание заказа
```
GET /public/profile/orders/:orderId/tracking
Authorization: Bearer <token>
```

### Добавить адрес
```
POST /public/profile/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "label": "Home",
  "recipientName": "John Doe",
  "phone": "+77001234567",
  "street": "123 Main St",
  "city": "Almaty",
  "postalCode": "050000",
  "country": "Kazakhstan",
  "isDefault": true
}
```

### Удалить адрес
```
DELETE /public/profile/addresses/:addressId
Authorization: Bearer <token>
```

### Статистика
```
GET /public/profile/stats
Authorization: Bearer <token>
```

---

## 🎫 Тикеты поддержки (требует авторизации)

### Создать тикет
```
POST /public/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Проблема с заказом",
  "description": "Мой заказ не был доставлен вовремя",
  "category": "delivery",
  "priority": "high"
}
```

**Категории:** `order`, `product`, `delivery`, `payment`, `account`, `technical`, `other`  
**Приоритеты:** `low`, `medium`, `high`, `urgent`

### Мои тикеты
```
GET /public/tickets
Authorization: Bearer <token>
```

### Детали тикета
```
GET /public/tickets/:id
Authorization: Bearer <token>
```

### Добавить сообщение
```
POST /public/tickets/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Есть дополнительная информация по проблеме"
}
```

---

## 🔧 Админ: Пользователи (роль: admin)

### Список пользователей
```
GET /admin/users
Authorization: Bearer <token>

Query: ?role=moderator&page=1&limit=20&search=John
```

### Создать пользователя
```
POST /admin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullname": "Staff Member",
  "phone": "+77009998877",
  "password": "password123",
  "role": "moderator"
}
```

### Обновить пользователя
```
PATCH /admin/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullname": "Updated Name",
  "role": "support",
  "isActive": true
}
```

### Деактивировать пользователя
```
DELETE /admin/users/:id
Authorization: Bearer <token>
```

---

## 🔧 Админ: Каталог (роль: admin)

### Получить каталог
```
GET /admin/catalog
Authorization: Bearer <token>
```

### Переключить категорию
```
PATCH /admin/catalog/categories/:id/toggle
Authorization: Bearer <token>
```

### Переключить подкатегорию
```
PATCH /admin/catalog/subcategories/:id/toggle
Authorization: Bearer <token>
```

### Заполнить каталог
```
POST /admin/catalog/seed
Authorization: Bearer <token>
```

---

## 🔧 Админ: Товары (роль: admin)

### Список товаров
```
GET /admin/products
Authorization: Bearer <token>

Query: ?slug=iphone-15
```

### Создать товар
```
POST /admin/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "iPhone 15 Pro",
  "categorySlug": "electronics",
  "subcategorySlug": "smartphones",
  "price": 499990,
  "stock": 10,
  "description": "Apple iPhone 15 Pro",
  "attributes": [
    { "key": "color", "label": "Color", "value": "Space Gray" }
  ]
}
```

### Обновить товар
```
PATCH /admin/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 449990,
  "stock": 50,
  "isActive": true,
  "attributes": [...]
}
```

### Удалить товар
```
DELETE /admin/products/:id
Authorization: Bearer <token>
```

### Загрузить изображения
```
POST /admin/products/:id/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

images: [file1.jpg, file2.png]  (до 10 файлов, макс 10MB каждый)
```

### Удалить изображение
```
DELETE /admin/products/:id/images/:imageIndex
Authorization: Bearer <token>
```
imageIndex - индекс изображения в массиве images (начиная с 0).

### Увеличить остаток
```
PATCH /admin/products/:id/increase-stock
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 10
}
```

### Уменьшить остаток
```
PATCH /admin/products/:id/decrease-stock
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}
```

---

## 📊 Админ: Аналитика (роль: admin)

### Продажи
```
GET /admin/analytics/sales
Authorization: Bearer <token>
```

### Персонал
```
GET /admin/analytics/staff
Authorization: Bearer <token>
```

### Обзор системы
```
GET /admin/analytics/overview
Authorization: Bearer <token>
```

---

## 📦 Модератор (роль: moderator)

### Список заказов
```
GET /moderator/orders
Authorization: Bearer <token>

Query: ?status=created&page=1&limit=20
```

### Статистика
```
GET /moderator/orders/stats
Authorization: Bearer <token>
```

### Принять заказ
```
POST /moderator/orders/:id/accept
Authorization: Bearer <token>
```

### Упаковать заказ
```
POST /moderator/orders/:id/pack
Authorization: Bearer <token>
```

### Назначить курьера
```
POST /moderator/orders/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "courierId": "507f1f77bcf86cd799439021"
}
```

### Отменить заказ
```
POST /moderator/orders/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Товар закончился на складе"
}
```

### Список курьеров
```
GET /moderator/couriers
Authorization: Bearer <token>
```

---

## 🚴 Курьер (роль: courier)

### Мои заказы
```
GET /courier/orders
Authorization: Bearer <token>
```

### Доступные заказы
```
GET /courier/orders/available
Authorization: Bearer <token>
```

### Статистика
```
GET /courier/orders/stats
Authorization: Bearer <token>
```

### Принять заказ
```
POST /courier/orders/:id/accept
Authorization: Bearer <token>
```

### Начать доставку
```
POST /courier/orders/:id/start
Authorization: Bearer <token>
```

### Завершить доставку
```
POST /courier/orders/:id/delivered
Authorization: Bearer <token>
```

---

## 🎫 Поддержка (роль: support)

### Мои тикеты
```
GET /support/tickets
Authorization: Bearer <token>
```

### Открытые тикеты
```
GET /support/tickets/open
Authorization: Bearer <token>
```

### Статистика
```
GET /support/tickets/stats
Authorization: Bearer <token>
```

### Принять тикет
```
POST /support/tickets/:id/accept
Authorization: Bearer <token>
```

### Освободить тикет
```
POST /support/tickets/:id/release
Authorization: Bearer <token>
```

### Ответить
```
POST /support/tickets/:id/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Мы проверили вашу проблему и исправили её."
}
```

### Решить тикет
```
POST /support/tickets/:id/resolve
Authorization: Bearer <token>
```

### Закрыть тикет
```
POST /support/tickets/:id/close
Authorization: Bearer <token>
```

### Переоткрыть тикет
```
POST /support/tickets/:id/reopen
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Проблема повторилась"
}
```

---

## 📝 Статусы заказов

```
created → accepted_by_moderator → packed → assigned_to_courier → in_delivery → delivered
                                       ↓
                                   canceled
```

| Статус | Описание | Кто может изменить |
|--------|----------|-------------------|
| created | Заказ создан | Модератор, пользователь |
| accepted_by_moderator | Принят модератором | Модератор, пользователь |
| packed | Упакован | Модератор, пользователь |
| assigned_to_courier | Назначен курьеру | Только модератор |
| in_delivery | В доставке | Только курьер |
| delivered | Доставлен | Курьер |
| canceled | Отменен | Модератор или пользователь (если возможно) |

---

## 📝 Статусы тикетов

```
open → assigned → resolved → closed
         ↓
     reopened → assigned
```

| Статус | Описание |
|--------|----------|
| open | Открыт |
| assigned | Назначен агенту |
| resolved | Решен |
| closed | Закрыт |
| reopened | Переоткрыт |

---

## ⚠️ Коды ошибок

| HTTP код | Значение |
|----------|----------|
| 400 | Bad Request - ошибка валидации |
| 401 | Unauthorized - не авторизован |
| 403 | Forbidden - нет прав доступа |
| 404 | Not Found - ресурс не найден |
| 409 | Conflict - конфликт (например, дубликат) |
| 500 | Internal Server Error |

---

## 📁 Загрузка файлов

Для загрузки изображений используйте `multipart/form-data`:

```javascript
const formData = new FormData();
formData.append('images', fileInput.files[0]);
formData.append('images', fileInput.files[1]);

const response = await fetch('/api/admin/products/ID/images', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

**Ограничения:**
- Формат: только изображения (image/*)
- Максимум файлов: 10
- Максимум размер файла: 10MB

---

## 🔄 Примеры запросов

### Пример: Полный цикл покупки

1. **Логин**
```javascript
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone: '+77001234567', password: 'password123' })
});
const { data: { token } } = await loginRes.json();
```

2. **Добавить в корзину**
```javascript
await fetch('/api/public/cart', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({ productId: '...', quantity: 1 })
});
```

3. **Оформить заказ**
```javascript
await fetch('/api/public/orders', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    recipientName: 'John Doe',
    recipientPhone: '+77001234567',
    deliveryAddress: { street: '...', city: 'Almaty', postalCode: '050000', country: 'Kazakhstan' }
  })
});
```
