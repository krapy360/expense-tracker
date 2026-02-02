import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000";

function App() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // STEP 1️⃣ — Form state
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: ""
  });

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/expenses?sort=date_desc`);
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // STEP 2️⃣ — Form change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // STEP 3️⃣ — Submit handler (idempotent)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      amount: Math.round(Number(form.amount) * 100), // ₹ → paise
      category: form.category,
      description: form.description,
      date: form.date,
      idempotencyKey: crypto.randomUUID()
    };

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to add expense");

      // Reset form + refresh list
      setForm({ amount: "", category: "", description: "", date: "" });
      fetchExpenses();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 7️⃣ — Filtered expenses + total
  const visibleExpenses = expenses.filter(
    (e) => !categoryFilter || e.category === categoryFilter
  );

  const total = visibleExpenses.reduce((sum, e) => sum + e.amount, 0);

  // ⭐ NICE-TO-HAVE 2️⃣ — Summary by category
  const summaryByCategory = visibleExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 16px" }}>
      <h1>Expense Tracker</h1>

      {/* STEP 4️⃣ — Expense Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
        <input
          name="amount"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>

      {/* STEP 8️⃣ — Filter + Total */}
      <div style={{ marginBottom: "16px" }}>
        <label>
          Filter by category:{" "}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All</option>
            {[...new Set(expenses.map((e) => e.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <p style={{ marginTop: "8px" }}>
          <strong>Total:</strong> ₹{(total / 100).toFixed(2)}
        </p>

        {/* ⭐ NICE-TO-HAVE 2️⃣ — Summary View */}
        {Object.keys(summaryByCategory).length > 0 && (
          <div style={{ marginTop: "12px" }}>
            <strong>Summary by Category:</strong>
            <ul>
              {Object.entries(summaryByCategory).map(([cat, amt]) => (
                <li key={cat}>
                  {cat}: ₹{(amt / 100).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {loading && <p>Loading expenses…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {visibleExpenses.map((e) => (
          <li key={e.id}>
            {e.date} — {e.category} — ₹{(e.amount / 100).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
