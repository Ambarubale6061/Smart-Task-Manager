const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const taskRoutes = require("./routes/task.routes");
const pool = require("./config/database");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/tasks", taskRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize DB (Create tables if not exist)
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      priority TEXT,
      status TEXT,
      assigned_to TEXT,
      due_date TIMESTAMP,
      extracted_entities JSONB,
      suggested_actions JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS task_history (
      id UUID PRIMARY KEY,
      task_id UUID REFERENCES tasks(id),
      action TEXT,
      old_value JSONB,
      new_value JSONB,
      changed_by TEXT,
      changed_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("Database initialized");
}

initDB();
