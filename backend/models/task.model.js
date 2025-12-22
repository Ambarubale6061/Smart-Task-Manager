const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class Task {
  static async create(data) {
    const id = uuidv4();
    const query = `
      INSERT INTO tasks (id, title, description, category, priority, status, assigned_to, due_date, extracted_entities, suggested_actions, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW(),NOW())
      RETURNING *;
    `;
    const values = [
      id,
      data.title,
      data.description || "",
      data.category,
      data.priority,
      data.status || "pending",
      data.assigned_to || null,
      data.due_date || null,
      JSON.stringify(data.extracted_entities || {}),
      JSON.stringify(data.suggested_actions || {}),
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(filters = {}, limit = 50, offset = 0) {
    let query = "SELECT * FROM tasks WHERE 1=1";
    let values = [];
    let idx = 1;
    for (let key in filters) {
      query += ` AND ${key}=$${idx}`;
      values.push(filters[key]);
      idx++;
    }
    query += ` ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
    values.push(limit, offset);
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM tasks WHERE id=$1", [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    let setQuery = keys.map((k, i) => `${k}=$${i + 1}`).join(", ");
    const query = `UPDATE tasks SET ${setQuery}, updated_at=NOW() WHERE id='${id}' RETURNING *;`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id=$1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Task;
