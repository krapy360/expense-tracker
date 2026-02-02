const Database = require("better-sqlite3");

// Create / open SQLite DB file
const db = new Database("expenses.db");

// Create table if it does not exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount INTEGER NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    idempotency_key TEXT UNIQUE NOT NULL
  )
`).run();

module.exports = db;
