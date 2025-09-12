# 📊 Local Service Finder API

A modular, production-ready REST API for tracking expenses, built with **TypeScript**, **Express.js**, and **MongoDB**, featuring **Swagger documentation**, structured error handling, request validation, and robust logging.



## 📦 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/iqbal-dev/expense-tracker-api.git
cd expense-tracker-api
yarn install
```

### 2. Setup Environment

Copy `.env.example` and update it:

```bash
cp .env.example .env
```

**Example .env:**

```env
 DB_USER=
 DB_PASS=
 DB_NAME=
 DB_HOST=
 DB_PORT=3306
 JWT_SECRET=
```

---

## 🔧 Scripts

| Command         | Description                       |
| --------------- | --------------------------------- |
| `yarn dev`      | Start dev server with ts-node-dev |
| `yarn build`    | Build TypeScript into `dist`      |
| `yarn start`    | Run built app                     |
| `yarn lint`     | Run ESLint                        |
| `yarn prettier` | Format code with Prettier         |

---

## 📂 API Versioning

All routes are under:

```
/api/v1/
```

---

## 🧾 API Documentation (Swagger)

Visit:

```
http://localhost:3000/api-docs
```

Explore all endpoints, responses, and schemas with **Swagger UI**.

---

## 🛡️ Authentication

JWT-based authentication:

- Login/Register via `/auth`
- Pass JWT token in headers:

```
Authorization: Bearer <your_token>
```

---

## 🧰 Logging

- Console logs in development
- Daily rotated `.log` files saved to `/logs/`
- HTTP logs captured via Morgan → Winston

---

## ❌ Error Handling

Errors follow a consistent structure:

```json
{
  "success": false,
  "message": "Resource not found",
  "errors": [],
  "stack": "Only in development"
}
```

Handled cases:

- Route not found (404)
- Mongoose validation errors
- Zod validation errors
- API custom errors
- Generic server errors (500)

---

## 📚 Example API

### POST `/api/v1/expenses`

```json
{
  "title": "Grocery",
  "amount": 100.25,
  "categoryId": "665019aa9f4...",
  "date": "2025-05-24"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "_id": "66501acde...",
    "title": "Grocery",
    ...
  }
}
```

---

## ✅ Pre-commit Checks

Husky runs Prettier + ESLint before each commit:

```bash
yarn format && yarn lint
```

To skip:

```bash
git commit --no-verify
```

---

## 🧪 Testing

Tests are not yet implemented. Recommended tools:

- Unit: `jest`
- Integration: `supertest`

---

## 🤝 Contributing

1. Fork this repo
2. Create a new branch `feat/my-feature`
3. Commit and push your changes
4. Open a Pull Request!

---

## 📄 License

MIT License © 2025 Md Iqbal Hossain

---
