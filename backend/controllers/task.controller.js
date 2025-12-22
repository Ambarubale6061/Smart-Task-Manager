const Task = require("../models/task.model");
const TaskHistory = require("../models/taskHistory.model");
const { classifyTask } = require("../services/classification.service");

async function createTask(req, res) {
  try {
    const { title, description, assigned_to, due_date } = req.body;
    const classification = classifyTask(title, description);
    const taskData = {
      title,
      description,
      assigned_to,
      due_date,
      ...classification,
    };
    const task = await Task.create(taskData);
    await TaskHistory.log(task.id, "created", null, task);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTasks(req, res) {
  try {
    const { status, category, priority, limit = 50, offset = 0 } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (category) filters.category = category;
    if (priority) filters.priority = priority;
    const tasks = await Task.findAll(
      filters,
      parseInt(limit),
      parseInt(offset)
    );
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTaskById(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateTask(req, res) {
  try {
    const oldTask = await Task.findById(req.params.id);
    if (!oldTask) return res.status(404).json({ error: "Task not found" });
    const updatedData = req.body;
    const updatedTask = await Task.update(req.params.id, updatedData);
    await TaskHistory.log(req.params.id, "updated", oldTask, updatedTask);
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteTask(req, res) {
  try {
    const deletedTask = await Task.delete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: "Task not found" });
    await TaskHistory.log(req.params.id, "deleted", deletedTask, null);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
