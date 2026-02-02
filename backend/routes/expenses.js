const express = require("express");
const { z } = require("zod");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");

const router = express.Router();

// Validation schema
const expenseSchema = z.object({
  amount: z.number().int().positive(),
  category: z.string().min(1),
  description: z.string().optional(),
  date: z.string(),
  idempotencyKey: z.string().min(1)
});

/**
 * POST /expenses
 * Idempotent create expense
 */
router.post("/", (req, res) => {
  const parsed = expenseSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  const { amount, category, description, date, idempotencyKey } = parsed.data;

  // Retry protection
  const existing = db
    .prepare("SELECT * FROM expenses WHERE idempotency_key = ?")
    .get(idempotencyKey);

  if (existing) {
    return res.json(existing);
  }

  const expense = {
    id: uuidv4(),
    amount,
    category,
    description,
    date,
    created_at: new Date().toISOString(),
    idempotency_key: idempotencyKey
  };

  db.prepare(`
    INSERT INTO expenses
    (id, amount, category, description, date, created_at, idempotency_key)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    expense.id,
    expense.amount,
    expense.category,
    expense.description,
    expense.date,
    expense.created_at,
    expense.idempotency_key
  );

  res.status(201).json(expense);
});

/**
 * GET /expenses
 * Supports filtering and sorting
 */
router.get("/", (req, res) => {
  const { category, sort } = req.query;

  let query = "SELECT * FROM expenses";
  const params = [];

  if (category) {
    query += " WHERE category = ?";
    params.push(category);
  }

  if (sort === "date_desc") {
    query += " ORDER BY date DESC";
  }

  const expenses = db.prepare(query).all(...params);
  res.json(expenses);
});

module.exports = router;
