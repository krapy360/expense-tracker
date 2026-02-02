# Expense Tracker – Full Stack Assignment

This project is a simple but production-minded **Expense Tracker** built as a full-stack application.  
It allows users to create, view, filter, and summarize expenses while handling real-world concerns like retries, data consistency, and deployment.

The goal was to prioritize **correctness, clarity, and robustness** over visual complexity.

---

## 🔗 Live URLs

- **Frontend (Vercel):** https://expense-tracker-2-kohl.vercel.app  
- **Backend API (Render):** https://expense-tracker-k2c3.onrender.com  

Health check:
GET /health


---

## ✅ Implemented Features

### Core Requirements
- Create a new expense with:
  - Amount
  - Category
  - Description (optional)
  - Date
- View all expenses
- Filter expenses by category
- Sort expenses by date (descending)
- Display total of visible expenses

### Production-Oriented Enhancements
- **Idempotent expense creation** to safely handle retries
- Amounts stored as **integers (paise)** to avoid floating-point precision issues
- Graceful loading and error states in the UI
- Backend validation for required fields

### Nice-to-Have (Implemented)
- Basic validation (required fields, non-negative amounts)
- **Summary view**: total spend per category
- Clear error feedback when API calls fail

---

## 🏗️ Architecture Overview


expense-tracker/
├── backend/
│   ├── index.js            # Express server
│   ├── routes/
│   │   └── expenses.js     # Expense routes
│   ├── db.js               # SQLite database setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   └── App.jsx         # React UI
│   └── package.json
│
└── README.md




---

## 🧠 Key Design Decisions

### Idempotent API Design
- Each `POST /expenses` request includes an `idempotencyKey`
- If the same key is sent again, the server returns the **original expense**
- Prevents duplicate records caused by:
  - Page refresh
  - Double submit
  - Network retries

This mirrors real-world financial system behavior.

---

### Money Handling
- Amounts are stored as **integers (paise)** instead of floats
- Eliminates rounding and precision errors common with currency values

---

### Database Choice
- **SQLite** was chosen for simplicity and portability
- Suitable for a personal expense tracker and easy to migrate later
- Keeps the system lightweight and dependency-minimal

---

### Frontend Approach
- Minimal UI with focus on data correctness
- Explicit loading and error states
- Environment-based API configuration (`VITE_API_URL`)

---

## 🔌 API Documentation

### `POST /expenses`
Creates a new expense.

**Request body:**
```json
{
  "amount": 25000,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-02-01",
  "idempotencyKey": "unique-client-key"
}
Behavior:

Duplicate idempotencyKey → returns existing expense

Ensures safe retries

GET /expenses
Fetch all expenses.

Query parameters:

category – filter by category

sort=date_desc – newest first

💾 Data Model
Expense {
  id: string
  amount: number        // stored in paise
  category: string
  description: string
  date: string          // YYYY-MM-DD
  created_at: string
  idempotency_key: string
}
⚖️ Trade-offs & Assumptions
No authentication (single-user assumption)

No pagination (expected small dataset)

No charts (kept UI minimal)

No optimistic UI updates (prioritized correctness)

These choices were made intentionally to stay within scope while keeping the system production-safe.

🧪 Testing Approach
Manual API testing using browser and curl

Verified idempotency by repeating POST requests

UI tested against failed and slow API responses

🚀 Local Setup
Backend
cd backend
npm install
npm run dev
Runs on http://localhost:4000

Frontend
cd frontend
npm install
npm run dev
Runs on http://localhost:5173

🌍 Environment Variables
Frontend (.env)
VITE_API_URL=https://expense-tracker-k2c3.onrender.com
🔮 Future Improvements
Authentication and multi-user support

Monthly and yearly analytics

Charts for category trends

Automated integration tests

Pagination for large datasets

👤 Author
Deep Panchal
