import { useState, useEffect } from "react";

// ─── TaskForm Component ───────────────────────────────────────────────────
// Handles both CREATE and EDIT task functionality
// Mode is determined by whether editTask prop is provided

const TaskForm = ({ onSubmit, editTask, onCancelEdit, isLoading }) => {
  // ── Form State ────────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  // ── Determine if we are in Edit Mode ─────────────────────────────────
  const isEditMode = Boolean(editTask);

  // ── Populate form when editing ────────────────────────────────────────
  // When editTask prop changes, fill form with existing task data
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || "");
      setDescription(editTask.description || "");
      setDueDate(editTask.dueDate || "");
      setIsExpanded(true); // Auto expand form in edit mode
    } else {
      // Reset form when not editing
      resetForm();
    }
  }, [editTask]);

  // ── Reset Form to Empty State ─────────────────────────────────────────
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setErrors({});
    setIsExpanded(false);
  };

  // ── Validate Form ─────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    // Title is required
    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    } else if (title.trim().length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    // Description length check (optional field)
    if (description && description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    // Due date cannot be in the past (only for new tasks)
    if (dueDate && !isEditMode) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(dueDate);
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);

    // Returns true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // ── Handle Form Submission ────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Stop if validation fails
    if (!validateForm()) return;

    // Call parent's onSubmit function with form data
    const success = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
    });

    // Reset form if submission was successful
    if (success) {
      resetForm();
    }
  };

  // ── Handle Cancel Edit ────────────────────────────────────────────────
  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) onCancelEdit();
  };

  // ── Get today's date for min date attribute ───────────────────────────
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="card mb-6 overflow-hidden">
      {/* ── Form Header ── */}
      <div
        className={`
          px-5 py-4 border-b border-gray-100
          flex items-center justify-between
          ${isEditMode ? "bg-blue-50" : "bg-white"}
        `}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">
            {isEditMode ? "✏️" : "➕"}
          </span>
          <h2 className="font-semibold text-gray-800">
            {isEditMode ? "Edit Task" : "Add New Task"}
          </h2>
        </div>

        {/* Expand/Collapse toggle (only in create mode) */}
        {!isEditMode && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Toggle form"
          >
            <svg
              className={`w-5 h-5 transform transition-transform duration-200
                ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* ── Form Body ── */}
      {(isExpanded || isEditMode) && (
        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* ── Title Field ── */}
          <div>
            <label className="input-label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                // Clear error when user starts typing
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: "" }));
                }
              }}
              placeholder="What needs to be done?"
              className={`
                input-field
                ${errors.title ? "border-red-400 focus:ring-red-400" : ""}
              `}
              maxLength={100}
              autoFocus={isEditMode}
            />
            {/* Title Error Message */}
            {errors.title && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>⚠️</span> {errors.title}
              </p>
            )}
            {/* Character Counter */}
            <p className="mt-1 text-xs text-gray-400 text-right">
              {title.length}/100
            </p>
          </div>

          {/* ── Description Field ── */}
          <div>
            <label className="input-label">
              Description{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              placeholder="Add more details about this task..."
              rows={3}
              className={`
                input-field resize-none
                ${errors.description
                  ? "border-red-400 focus:ring-red-400"
                  : ""}
              `}
              maxLength={500}
            />
            {/* Description Error */}
            {errors.description && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>⚠️</span> {errors.description}
              </p>
            )}
            {/* Character Counter */}
            <p className="mt-1 text-xs text-gray-400 text-right">
              {description.length}/500
            </p>
          </div>

          {/* ── Due Date Field ── */}
          <div>
            <label className="input-label">
              Due Date{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) {
                  setErrors((prev) => ({ ...prev, dueDate: "" }));
                }
              }}
              min={!isEditMode ? getTodayString() : undefined}
              className={`
                input-field
                ${errors.dueDate
                  ? "border-red-400 focus:ring-red-400"
                  : ""}
              `}
            />
            {/* Due Date Error */}
            {errors.dueDate && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>⚠️</span> {errors.dueDate}
              </p>
            )}
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex items-center gap-3 pt-2">
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="spinner w-4 h-4" />
                  <span>
                    {isEditMode ? "Updating..." : "Creating..."}
                  </span>
                </>
              ) : (
                <>
                  <span>{isEditMode ? "✏️" : "➕"}</span>
                  <span>
                    {isEditMode ? "Update Task" : "Create Task"}
                  </span>
                </>
              )}
            </button>

            {/* Cancel Button (Edit Mode) or Clear Button (Create Mode) */}
            {isEditMode ? (
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            ) : (
              (title || description || dueDate) && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Clear
                </button>
              )
            )}
          </div>
        </form>
      )}

      {/* ── Collapsed State (Create Mode only) ── */}
      {!isExpanded && !isEditMode && (
        <button
          onClick={() => setIsExpanded(true)}
          className="
            w-full px-5 py-3
            text-left text-gray-400
            hover:text-gray-600 hover:bg-gray-50
            transition-colors duration-200
            text-sm
          "
        >
          + Click to add a new task...
        </button>
      )}
    </div>
  );
};

export default TaskForm;