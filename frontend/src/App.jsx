import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 16px" }}>
      <h1>Expense Tracker</h1>

      {loading && <p>Loading expenses…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            {e.date} — {e.category} — ₹{(e.amount / 100).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
