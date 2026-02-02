const express = require("express");
const cors = require("cors");

const expensesRoutes = require("./routes/expenses");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/expenses", expensesRoutes);

app.get("/", (req, res) => {
  res.send("Expense Tracker API is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
