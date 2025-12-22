const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class TaskHistory {
  static async log(
    task_id,
    action,
    old_value,
    new_value,
    changed_by = "system"
  ) {
    const id = uuidv4();
    const query = `
      INSERT INTO task_history (id, task_id, action, old_value, new_value, changed_by, changed_at)
      VALUES ($1,$2,$3,$4,$5,$6,NOW())
      RETURNING *;
    `;
    const values = [
      id,
      task_id,
      action,
      JSON.stringify(old_value || {}),
      JSON.stringify(new_value || {}),
      changed_by,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = TaskHistory;
