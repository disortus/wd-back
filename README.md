# WD-Back — Backend для интернет-магазина Apple-продукции

**Версия:** 1.0.0  
**Технологический стек:** Node.js, Express.js 5, MongoDB, Mongoose, JWT

---

## 📋 Описание проекта

WD-Back — это полнофункциональный backend для интернет-магазина по продаже реплик продукции Apple с системой онлайн-заказов и доставки. Проект построен на современном стеке Node.js с использованием Express.js и MongoDB.

### Основные возможности

- **Аутентификация и авторизация** — JWT-токены с поддержкой cookie и заголовков
- **Каталог товаров** — категории, подкатегории, атрибуты товаров
- **Корзина и заказы** — полный цикл оформления заказа
- **Система ролей** — пользователи, администраторы, модераторы, курьеры, поддержка
- **Тикет-система** — обращения в поддержку с категориями и приоритетами
- **Профиль пользователя** — управление адресами, статистика заказов

---

## 🏗 Архитектура проекта

```
wd-back/
├── config/              # Конфигурация (env, db)
├── docs/                # Swagger документация и схемы
├── scripts/             # Скрипты (seed, create-admin, тесты)
├── src/
│   ├── controllers/     # Бизнес-логика (по ролям)
│   │   ├── admin/       # Администратор
│   │   ├── moderator/  # Модератор
│   │   ├── courier/    # Курьер
│   │   ├── support/    # Поддержка
│   │   ├── public/     # Публичные (пользователь)
│   │   └── auth.controller.js, profile.controller.js
│   ├── middleware/     # Промежуточное ПО (auth, role, validation, errors)
│   ├── models/         # Mongoose модели (User, Product, Order, Cart, Ticket, Category)
│   ├── routers/        # Маршрутизация по ролям
│   ├── services/       # Сервисы
│   ├── utils/         # Утилиты (enums, errors, jwt, helpers)
│   └── validators/    # Валидация запросов
├── server.js          # Точка входа
└── package.json       # Зависимости
```

---

## 👥 Роли пользователей

| Роль | Описание |
|------|----------|
| `user` | Обычный покупатель |
| `admin` | Полный доступ к системе |
| `moderator` | Обработка заказов (принять, упаковать, назначить курьера) |
| `courier` | Управление доставкой |
| `support` | Обработка тикетов поддержки |

---

## 🚀 Установка и запуск

### Требования

- Node.js 18+
- MongoDB (локальный или облачный)

### Установка зависимостей

```bash
npm install
```

### Настройка окружения

Создайте файл `.env` в корне проекта:

```env
# Порт сервера
PORT=5000

# MongoDB URI
MONGO_URI=mongodb://localhost:27017/wd-back

# JWT Secret (минимум 32 символа)
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_EXPIRE=7d

# Администратор по умолчанию
ORIGINAL_ADMIN_FULLNAME=Admin
ORIGINAL_ADMIN_PHONE=+77000000000
ORIGINAL_ADMIN_PASSWORD=admin123

# Модератор по умолчанию
ORIGINAL_MODERATOR_FULLNAME=Moderator
ORIGINAL_MODERATOR_PHONE=+77000000001
ORIGINAL_MODERATOR_PASSWORD=mod123

# Курьер по умолчанию
ORIGINAL_COURIER_FULLNAME=Courier
ORIGINAL_COURIER_PHONE=+77000000002
ORIGINAL_COURIER_PASSWORD=courier123

# Поддержка по умолчанию
ORIGINAL_SUPPORT_FULLNAME=Support
ORIGINAL_SUPPORT_PHONE=+77000000003
ORIGINAL_SUPPORT_PASSWORD=support123
```

### Запуск

```bash
# Режим разработки (с nodemon)
npm run dev

# Продакшен режим
npm start
```

Сервер запустится на `http://localhost:5000`  
Документация API (Swagger): `http://localhost:5000/docs`

---

## 📦 Доступные скрипты

```bash
npm run dev              # Запуск с nodemon
npm start               # Запуск продакшен
npm run seed-catalog    # Заполнить каталог категориями и подкатегориями
npm run create-admin    # Создать администратора
npm run create-staff    # Создать персонал (модератор, курьер, поддержка)
npm run delete-admin    # Удалить администратора
npm run test            # Запустить полное тестирование
```

---

## 📡 API Эндпоинты

### Публичные маршруты (без авторизации)

| Метод | Маршрут | Описание |
|-------|---------|-----------|
| GET | `/api/public/` | Главная страница (hero, категории, товары) |
| GET | `/api/public/catalog/tree` | Дерево категорий |
| GET | `/api/public/products` | Список товаров с фильтрами |
| GET | `/api/public/products/:slug` | Товар по слагу |

### Аутентификация

| Метод | Маршрут | Описание |
|-------|---------|-----------|
| POST | `/api/auth/register` | Регистрация |
| POST | `/api/auth/login` | Вход |
| GET | `/api/auth/me` | Текущий пользователь |

### Корзина (авторизация)

| Метод | Маршрут | Описание |
|-------|---------|-----------|
| GET | `/api/public/cart` | Получить корзину |
| POST | `/api/public/cart` | Добавить товар |
| PATCH | `/api/public/cart/:productId` | Изменить количество |
| DELETE | `/api/public/cart/:productId` | Удалить товар |
| DELETE | `/api/public/cart` | Очистить корзину |

### Заказы (авторизация)

| Метод | Маршрут | Описание |
|-------|---------|-----------|
| POST | `/api/public/orders` | Создать заказ |
| GET | `/api/public/orders` | Мои заказы |
| GET | `/api/public/orders/:id` | Детали заказа |
| POST | `/api/public/orders/:id/cancel` | Отменить заказ |

### Тикеты поддержки (авторизация)

| Метод | Маршрут | Описание |
|-------|---------|-----------|
| POST | `/api/public/tickets` | Создать тикет |
| GET | `/api/public/tickets` | Мои тикеты |
| GET | `/api/public/tickets/:id` | Детали тикета |
| POST | `/api/public/tickets/:id/messages` | Добавить сообщение |

### Профиль (авторизация)

| Метод | Маршрут | Описание |
|-------|---------|-----------|
| GET | `/api/public/profile/me` | Мой профиль |
| PATCH | `/api/public/profile/me` | Обновить профиль |
| GET | `/api/public/profile/orders` | История заказов |
| GET | `/api/public/profile/orders/active` | Активные заказы |
| GET | `/api/public/profile/orders/:orderId/tracking` | Отслеживание заказа |
| POST | `/api/public/profile/addresses` | Добавить адрес |
| DELETE | `/api/public/profile/addresses/:addressId` | Удалить адрес |
| GET | `/api/public/profile/stats` | Статистика |

### Админ (роль: admin)

| Метод | Маршрут | Описание |
|-------|---------|-----------|
| GET | `/api/admin/users` | Список пользователей |
| POST | `/api/admin/users` | Создать пользователя |
| PATCH | `/api/admin/users/:id` | Обновить пользователя |
| PATCH | `/api/admin/users/:id/toggle` | Активировать/деактивировать |
| DELETE | `/api/admin/users/:id` | Удалить пользователя |
| GET | `/api/admin/catalog` | Категории и подкатегории |
| POST | `/api/admin/catalog/seed` | Заполнить каталог |
| PATCH | `/api/admin/catalog/categories/:id/toggle` | Переключить категорию |
| GET | `/api/admin/products` | Список товаров |
| POST | `/api/admin/products` | Создать товар |
| PATCH | `/api/admin/products/:id` | Обновить товар |
| DELETE | `/api/admin/products/:id` | Удалить товар |

### Модератор (роль: moderator)

| Метод | Маршрут | Описание |
|-------|---------|-----------|
| GET | `/api/moderator/orders` | Список заказов |
| GET | `/api/moderator/orders/stats` | Статистика заказов |
| POST | `/api/moderator/orders/:id/accept` | Принять заказ |
| POST | `/api/moderator/orders/:id/pack` | Упаковать заказ |
| POST | `/api/moderator/orders/:id/assign` | Назначить курьера |
| POST | `/api/moderator/orders/:id/cancel` | Отменить заказ |

### Курьер (роль: courier)

| Метод | Маршрут | Описание |
|-------|---------|-----------|
| GET | `/api/courier/orders` | Мои заказы на доставку |
| GET | `/api/courier/orders/available` | Доступные заказы |
| GET | `/api/courier/orders/stats` | Статистика доставок |
| POST | `/api/courier/orders/:id/accept` | Принять заказ |
| POST | `/api/courier/orders/:id/start` | Начать доставку |
| POST | `/api/courier/orders/:id/delivered` | Завершить доставку |

### Поддержка (роль: support)

| Метод | Маршрут | Описание |
|-------|---------|-----------|
| GET | `/api/support/tickets` | Мои тикеты |
| GET | `/api/support/tickets/open` | Открытые тикеты |
| GET | `/api/support/tickets/stats` | Статистика тикетов |
| POST | `/api/support/tickets/:id/accept` | Принять тикет |
| POST | `/api/support/tickets/:id/release` | Освободить тикет |
| POST | `/api/support/tickets/:id/message` | Ответить на тикет |
| POST | `/api/support/tickets/:id/resolve` | Решить тикет |
| POST | `/api/support/tickets/:id/close` | Закрыть тикет |
| POST | `/api/support/tickets/:id/reopen` | Переоткрыть тикет |

---

## 📊 Статусы заказов

```
created → accepted_by_modernator → packed → assigned_to_courier → in_delivery → delivered
                                      ↓
                                  canceled

Пользователь может отменить: created, accepted_by_moderator, packed
Пользователь НЕ может отменить: assigned_to_courier, in_delivery, delivered
```

---

## 📝 Статусы тикетов

```
open → assigned → resolved → closed
         ↓
     reopened → assigned
```

---

## 📂 Категории товаров

### Electronics (Электроника)
- smartphones — Смартфоны
- laptops — Ноутбуки
- tablets — Планшеты
- smart_watches — Умные часы
- headphones — Наушники
- desktops — Компьютеры

### Accessories (Аксессуары)
- chargers — Зарядные устройства
- cables — Кабели
- cases — Чехлы
- adapters — Адаптеры
- keyboards — Клавиатуры
- mice — Мыши
- apple_pencil — Apple Pencil
- hubs_docks — Хабы и док-станции

### Desktops & Monitors (Компьютеры и мониторы)
- desktops — Компьютеры
- monitors — Мониторы

---

## 🛡 Безопасность

- **JWT-аутентификация** — токены в cookies и заголовках
- **Helmet** — заголовки безопасности
- **CORS** — настроен для своего frontedn
- **Rate Limiting** — защита от DDoS
- **Валидация** — express-validator для всех входящих данных
- **bcrypt** — хеширование паролей

---

## 📝 Лицензия

ISC License — см. файл `package.json`

---

## 📚 Дополнительная документация

- Swagger UI: `http://localhost:5000/docs`
- Фронтенд-документация: `docs/AI_FRONTEND_DOCUMENTATION.md`
- Swagger схемы: `docs/schemas/`