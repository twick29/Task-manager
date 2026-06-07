import { useState, useEffect, useCallback } from "react";
import {
  getAllTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  reorderTasks,
} from "./services/api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterBar from "./components/FilterBar";
import SearchBar from "./components/SearchBar";
import StatsCard from "./components/StatsCard";

// ─── App Component ────────────────────────────────────────────────────────
// Root component — manages all state and coordinates all components

const App = () => {
  // ── State ─────────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);           // All tasks from server
  const [currentFilter, setCurrentFilter] = useState("all"); // Active filter
  const [searchQuery, setSearchQuery] = useState("");        // Search text
  const [editTask, setEditTask] = useState(null);            // Task being edited
  const [isLoading, setIsLoading] = useState(true);          // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);   // Form submitting
  const [error, setError] = useState(null);                  // Error message
  const [successMessage, setSuccessMessage] = useState("");  // Success toast

  // ── Fetch All Tasks ───────────────────────────────────────────────────
  // Called on mount and after every CRUD operation
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllTasks();
      setTasks(response.data || []);
    } catch (err) {
      setError("Failed to fetch tasks. Is the server running?");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Load Tasks on Mount ───────────────────────────────────────────────
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── Show Success Toast ────────────────────────────────────────────────
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000); // Hide after 3 seconds
  };

  // ── Handle Create or Update Task ──────────────────────────────────────
  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (editTask) {
        // UPDATE existing task
        await updateTask(editTask.id, formData);
        showSuccess("✅ Task updated successfully!");
        setEditTask(null);
      } else {
        // CREATE new task
        await createTask(formData);
        showSuccess("✅ Task created successfully!");
      }

      await fetchTasks(); // Refresh list
      return true; // Signal success to TaskForm
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save task. Try again."
      );
      return false; // Signal failure to TaskForm
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Handle Toggle Complete ────────────────────────────────────────────
  const handleToggle = async (id) => {
    try {
      setError(null);
      await toggleTask(id);
      // Update local state immediately (optimistic update)
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, completed: !task.completed }
            : task
        )
      );
    } catch (err) {
      setError("Failed to update task status.");
      await fetchTasks(); // Revert on error
    }
  };

  // ── Handle Delete ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      setError(null);
      await deleteTask(id);
      // Remove from local state immediately
      setTasks((prev) => prev.filter((task) => task.id !== id));
      showSuccess("🗑️ Task deleted successfully!");
      // Clear edit mode if deleted task was being edited
      if (editTask?.id === id) setEditTask(null);
    } catch (err) {
      setError("Failed to delete task.");
      await fetchTasks(); // Revert on error
    }
  };

  // ── Handle Edit ───────────────────────────────────────────────────────
  const handleEdit = (task) => {
    setEditTask(task);
    // Scroll to top to show the edit form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Handle Cancel Edit ────────────────────────────────────────────────
  const handleCancelEdit = () => {
    setEditTask(null);
  };

  // ── Handle Drag and Drop ──────────────────────────────────────────────
  const handleDragEnd = async (result) => {
    // Dropped outside the list
    if (!result.destination) return;

    // Same position — no change needed
    if (result.source.index === result.destination.index) return;

    // Reorder the filtered tasks array
    const reordered = Array.from(filteredTasks);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);

    // Update local state immediately for smooth UI
    setTasks((prev) => {
      const filtered = reordered.map((t) => t.id);
      const nonFiltered = prev.filter((t) => !filtered.includes(t.id));
      return [...reordered, ...nonFiltered];
    });

    // Save new order to server
    try {
      await reorderTasks(reordered);
    } catch (err) {
      setError("Failed to save new order.");
      await fetchTasks(); // Revert on error
    }
  };

  // ── Filter Tasks ──────────────────────────────────────────────────────
  const getFilteredTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = [...tasks];

    // Apply filter
    switch (currentFilter) {
      case "active":
        filtered = filtered.filter((task) => !task.completed);
        break;
      case "completed":
        filtered = filtered.filter((task) => task.completed);
        break;
      case "overdue":
        filtered = filtered.filter((task) => {
          if (!task.dueDate || task.completed) return false;
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < today;
        });
        break;
      default:
        // "all" — no filtering
        break;
    }

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }

    return filtered;
  };

  // Compute filtered tasks
  const filteredTasks = getFilteredTasks();

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* App Title */}
            <div className="flex items-center gap-3">
              <span className="text-3xl">✅</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Task Manager
                </h1>
                <p className="text-xs text-gray-500">
                  Stay organized, stay productive
                </p>
              </div>
            </div>

            {/* Task Count Badge */}
            <div className="flex items-center gap-2">
              <span className="badge-blue text-sm px-3 py-1">
                {tasks.filter((t) => !t.completed).length} active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-3xl mx-auto px-4 py-6">

        {/* ── Success Toast ── */}
        {successMessage && (
          <div className="
            mb-4 px-4 py-3
            bg-green-50 border border-green-200
            rounded-lg text-green-700 text-sm
            font-medium animate-fade-in
            flex items-center gap-2
          ">
            <span>{successMessage}</span>
          </div>
        )}

        {/* ── Error Banner ── */}
        {error && (
          <div className="
            mb-4 px-4 py-3
            bg-red-50 border border-red-200
            rounded-lg animate-fade-in
            flex items-center justify-between
          ">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Stats Cards ── */}
        <StatsCard tasks={tasks} />

        {/* ── Task Form (Create / Edit) ── */}
        <TaskForm
          onSubmit={handleSubmit}
          editTask={editTask}
          onCancelEdit={handleCancelEdit}
          isLoading={isSubmitting}
        />

        {/* ── Search and Filter Section ── */}
        <div className="card p-4 mb-4">
          {/* Search Bar */}
          <div className="mb-4 pb-4 border-b border-gray-100">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Filter Bar */}
          <FilterBar
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            tasks={tasks}
          />
        </div>

        {/* ── Task List ── */}
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDragEnd={handleDragEnd}
          isLoading={isLoading}
          currentFilter={currentFilter}
          searchQuery={searchQuery}
        />
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-8 text-xs text-gray-400">
        <p>Task Manager App · Built with React + Node.js</p>
      </footer>
    </div>
  );
};

export default App;