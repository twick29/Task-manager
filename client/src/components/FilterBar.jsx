// ─── FilterBar Component ──────────────────────────────────────────────────
// Renders filter buttons to show All / Active / Completed tasks

const FilterBar = ({ currentFilter, onFilterChange, tasks }) => {
  // ── Calculate counts for each filter ─────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allCount = tasks.length;

  const activeCount = tasks.filter((task) => !task.completed).length;

  const completedCount = tasks.filter((task) => task.completed).length;

  const overdueCount = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }).length;

  // ── Filter Options Configuration ──────────────────────────────────────
  // Each object defines one filter button
  const filters = [
    {
      label: "All",
      value: "all",
      count: allCount,
      icon: "📋",
    },
    {
      label: "Active",
      value: "active",
      count: activeCount,
      icon: "⚡",
    },
    {
      label: "Completed",
      value: "completed",
      count: completedCount,
      icon: "✅",
    },
    {
      label: "Overdue",
      value: "overdue",
      count: overdueCount,
      icon: "🚨",
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((filter) => {
        // Is this the currently active filter?
        const isActive = currentFilter === filter.value;

        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`
              flex items-center gap-1.5
              px-4 py-2 rounded-lg
              text-sm font-medium
              transition-all duration-200
              focus:outline-none focus:ring-2
              focus:ring-blue-400 focus:ring-offset-1
              ${
                isActive
                  ? // Active filter — blue background
                    "bg-blue-600 text-white shadow-sm scale-105"
                  : // Inactive filter — white background
                    "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }
              ${
                // Special red styling for overdue filter
                filter.value === "overdue" && !isActive && overdueCount > 0
                  ? "border-red-200 text-red-600 hover:bg-red-50"
                  : ""
              }
            `}
          >
            {/* Filter Icon */}
            <span>{filter.icon}</span>

            {/* Filter Label */}
            <span>{filter.label}</span>

            {/* Count Badge */}
            <span
              className={`
                inline-flex items-center justify-center
                w-5 h-5 rounded-full text-xs font-bold
                ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : filter.value === "overdue" && overdueCount > 0
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }
              `}
            >
              {filter.count}
            </span>
          </button>
        );
      })}

      {/* ── Clear Completed Button ── */}
      {/* Only shows when there are completed tasks */}
      {completedCount > 0 && (
        <div className="ml-auto">
          <span className="text-xs text-gray-400 flex items-center h-full">
            {completedCount} task{completedCount !== 1 ? "s" : ""} completed
          </span>
        </div>
      )}
    </div>
  );
};

export default FilterBar;