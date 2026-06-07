import { useState } from "react";

// ─── TaskItem Component ───────────────────────────────────────────────────
// Renders a single task card with all its details and action buttons

const TaskItem = ({ task, onToggle, onEdit, onDelete, isDragging }) => {
  // ── Local State ───────────────────────────────────────────────────────
  const [showConfirm, setShowConfirm] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Check if Task is Overdue ──────────────────────────────────────────
  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  // ── Check if Task is Due Today ────────────────────────────────────────
  const isDueToday = () => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  };

  // ── Format Date for Display ───────────────────────────────────────────
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ── Format Created At Date ────────────────────────────────────────────
  const formatCreatedAt = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ── Handle Toggle Complete ────────────────────────────────────────────
  const handleToggle = async () => {
    setIsToggling(true);
    await onToggle(task.id);
    setIsToggling(false);
  };

  // ── Handle Delete ─────────────────────────────────────────────────────
  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(task.id);
    setIsDeleting(false);
    setShowConfirm(false);
  };

  // ── Computed Values ───────────────────────────────────────────────────
  const overdue = isOverdue();
  const dueToday = isDueToday();

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div
      className={`
        card p-4 mb-3
        transition-all duration-200
        ${isDragging ? "shadow-lg scale-102 rotate-1 opacity-90" : "hover:shadow-md"}
        ${task.completed ? "opacity-75 bg-gray-50" : "bg-white"}
        ${overdue ? "border-l-4 border-l-red-500" : ""}
        ${dueToday && !task.completed ? "border-l-4 border-l-yellow-500" : ""}
      `}
    >
      <div className="flex items-start gap-3">
        {/* ── Drag Handle ── */}
        <div className="mt-1 text-gray-300 cursor-grab active:cursor-grabbing flex-shrink-0">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
          </svg>
        </div>

        {/* ── Checkbox Toggle ── */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`
            mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2
            transition-all duration-200 flex items-center justify-center
            ${task.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-400"
            }
            ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          {task.completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* ── Task Content ── */}
        <div className="flex-1 min-w-0">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`
                font-medium text-gray-800 break-words
                ${task.completed
                  ? "line-through text-gray-400"
                  : ""}
              `}
            >
              {task.title}
            </h3>

            {/* ── Status Badges ── */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {task.completed && (
                <span className="badge-green">✅ Done</span>
              )}
              {overdue && (
                <span className="badge-red">🚨 Overdue</span>
              )}
              {dueToday && !task.completed && (
                <span className="badge-yellow">⏰ Today</span>
              )}
              {!task.completed && !overdue && !dueToday && (
                <span className="badge-blue">⚡ Active</span>
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={`
                mt-1 text-sm break-words
                ${task.completed
                  ? "text-gray-400 line-through"
                  : "text-gray-600"}
              `}
            >
              {task.description}
            </p>
          )}

          {/* ── Meta Info Row ── */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {/* Due Date */}
            {task.dueDate && (
              <span
                className={`
                  flex items-center gap-1 text-xs
                  ${overdue
                    ? "text-red-600 font-medium"
                    : dueToday
                    ? "text-yellow-600 font-medium"
                    : "text-gray-400"}
                `}
              >
                <span>📅</span>
                <span>
                  {overdue && "Overdue · "}
                  {dueToday && "Due today · "}
                  {formatDate(task.dueDate)}
                </span>
              </span>
            )}

            {/* Created Date */}
            {task.createdAt && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <span>🕐</span>
                <span>Created {formatCreatedAt(task.createdAt)}</span>
              </span>
            )}
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex items-center gap-2 mt-3">
            {/* Edit Button */}
            <button
              onClick={() => onEdit(task)}
              className="
                flex items-center gap-1 px-3 py-1.5
                text-xs font-medium text-blue-600
                bg-blue-50 hover:bg-blue-100
                rounded-lg transition-colors duration-200
              "
            >
              <span>✏️</span>
              <span>Edit</span>
            </button>

            {/* Toggle Complete Button */}
            <button
              onClick={handleToggle}
              disabled={isToggling}
              className={`
                flex items-center gap-1 px-3 py-1.5
                text-xs font-medium rounded-lg
                transition-colors duration-200
                ${task.completed
                  ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                  : "text-green-600 bg-green-50 hover:bg-green-100"
                }
                ${isToggling ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <span>{task.completed ? "↩️" : "✅"}</span>
              <span>
                {isToggling
                  ? "..."
                  : task.completed
                  ? "Undo"
                  : "Complete"}
              </span>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => setShowConfirm(true)}
              className="
                flex items-center gap-1 px-3 py-1.5
                text-xs font-medium text-red-600
                bg-red-50 hover:bg-red-100
                rounded-lg transition-colors duration-200
                ml-auto
              "
            >
              <span>🗑️</span>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Dialog ── */}
      {showConfirm && (
        <div className="
          mt-3 p-3 bg-red-50 border border-red-200
          rounded-lg animate-fade-in
        ">
          <p className="text-sm text-red-700 font-medium mb-2">
            🗑️ Delete this task?
          </p>
          <p className="text-xs text-red-600 mb-3">
            "<strong>{task.title}</strong>" will be permanently deleted.
            This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="
                flex items-center gap-1 px-3 py-1.5
                text-xs font-medium text-white
                bg-red-500 hover:bg-red-600
                rounded-lg transition-colors duration-200
                disabled:opacity-50
              "
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="
                px-3 py-1.5 text-xs font-medium
                text-gray-600 bg-white
                border border-gray-200
                hover:bg-gray-50 rounded-lg
                transition-colors duration-200
              "
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;