const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// ─── Path to our JSON "database" file ───────────────────────────────────────
const DATA_FILE = path.join(__dirname, "../data/tasks.json");

// ─── HELPER: Read tasks from the JSON file ──────────────────────────────────
const readTasks = () => {
  try {
    const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    // If file is empty or broken, return empty array
    return [];
  }
};

// ─── HELPER: Write tasks to the JSON file ───────────────────────────────────
const writeTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
};

// ─── 1. GET ALL TASKS ───────────────────────────────────────────────────────
// GET /api/tasks
const getAllTasks = (req, res) => {
  try {
    const tasks = readTasks();

    // Sort by order field first, then by createdAt (newest first)
    const sortedTasks = tasks.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({
      success: true,
      count: sortedTasks.length,
      data: sortedTasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// ─── 2. CREATE A TASK ───────────────────────────────────────────────────────
// POST /api/tasks
const createTask = (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    // Validation — title is required
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title is required and cannot be empty",
      });
    }

    const tasks = readTasks();

    // New task object
    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      description: description ? description.trim() : "",
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: tasks.length, // placed at the end by default
    };

    tasks.unshift(newTask); // Add to beginning (newest first)

    // Fix order values after unshift
    tasks.forEach((task, index) => {
      task.order = index;
    });

    writeTasks(tasks);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// ─── 3. UPDATE A TASK ───────────────────────────────────────────────────────
// PUT /api/tasks/:id
const updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    // Validation — title is required
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title is required and cannot be empty",
      });
    }

    const tasks = readTasks();

    // Find the task index
    const taskIndex = tasks.findIndex((task) => task.id === id);

    // If task not found
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Update only the allowed fields
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title.trim(),
      description: description ? description.trim() : "",
      dueDate: dueDate || null,
      updatedAt: new Date().toISOString(),
    };

    writeTasks(tasks);

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: tasks[taskIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

// ─── 4. TOGGLE TASK COMPLETE / INCOMPLETE ───────────────────────────────────
// PATCH /api/tasks/:id/toggle
const toggleTask = (req, res) => {
  try {
    const { id } = req.params;
    const tasks = readTasks();

    // Find the task index
    const taskIndex = tasks.findIndex((task) => task.id === id);

    // If task not found
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Flip the completed value
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    tasks[taskIndex].updatedAt = new Date().toISOString();

    writeTasks(tasks);

    res.status(200).json({
      success: true,
      message: `Task marked as ${tasks[taskIndex].completed ? "completed" : "active"}`,
      data: tasks[taskIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle task",
      error: error.message,
    });
  }
};

// ─── 5. DELETE A TASK ───────────────────────────────────────────────────────
// DELETE /api/tasks/:id
const deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    const tasks = readTasks();

    // Find the task index
    const taskIndex = tasks.findIndex((task) => task.id === id);

    // If task not found
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Remove the task from array
    const deletedTask = tasks.splice(taskIndex, 1)[0];

    // Fix order values after deletion
    tasks.forEach((task, index) => {
      task.order = index;
    });

    writeTasks(tasks);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

// ─── 6. REORDER TASKS (Drag and Drop) ───────────────────────────────────────
// PATCH /api/tasks/reorder
const reorderTasks = (req, res) => {
  try {
    const { tasks: reorderedTasks } = req.body;

    if (!Array.isArray(reorderedTasks)) {
      return res.status(400).json({
        success: false,
        message: "Tasks must be an array",
      });
    }

    // Update order values based on new positions
    const updatedTasks = reorderedTasks.map((task, index) => ({
      ...task,
      order: index,
      updatedAt: new Date().toISOString(),
    }));

    writeTasks(updatedTasks);

    res.status(200).json({
      success: true,
      message: "Tasks reordered successfully",
      data: updatedTasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reorder tasks",
      error: error.message,
    });
  }
};

// ─── Export all controllers ──────────────────────────────────────────────────
module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  reorderTasks,
};