const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  reorderTasks,
} = require("../controllers/taskController");

// ─── Task Routes ─────────────────────────────────────────────────────────────

// GET    /api/tasks          → Get all tasks
router.get("/", getAllTasks);

// POST   /api/tasks          → Create a new task
router.post("/", createTask);

// PATCH  /api/tasks/reorder  → Reorder tasks (drag and drop)
// ⚠️ This MUST be before /:id routes — otherwise Express reads
// "reorder" as an :id value
router.patch("/reorder", reorderTasks);

// PUT    /api/tasks/:id      → Update a task by ID
router.put("/:id", updateTask);

// PATCH  /api/tasks/:id/toggle → Toggle complete/incomplete
router.patch("/:id/toggle", toggleTask);

// DELETE /api/tasks/:id      → Delete a task by ID
router.delete("/:id", deleteTask);

module.exports = router;