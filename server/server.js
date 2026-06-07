const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const taskRoutes = require("./routes/taskRoutes");

// ─── Initialize Express App ──────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Ensure data folder and tasks.json exist ────────────────────────────────
const dataDir = path.join(__dirname, "data");
const tasksFile = path.join(dataDir, "tasks.json");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(tasksFile)) {
  fs.writeFileSync(tasksFile, "[]", "utf-8");
}

// ─── Middleware ──────────────────────────────────────────────────────────────

// Allow frontend (port 5173) to talk to backend (port 5000)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check route — visit http://localhost:5000/
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Task Manager API is running! 🚀",
    version: "1.0.0",
    endpoints: {
      getAllTasks: "GET /api/tasks",
      createTask: "POST /api/tasks",
      updateTask: "PUT /api/tasks/:id",
      toggleTask: "PATCH /api/tasks/:id/toggle",
      deleteTask: "DELETE /api/tasks/:id",
      reorderTasks: "PATCH /api/tasks/reorder",
    },
  });
});

// All task-related routes
app.use("/api/tasks", taskRoutes);

// ─── 404 Handler (unknown routes) ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("─────────────────────────────────────────");
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Tasks stored in: ${tasksFile}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("─────────────────────────────────────────");
});