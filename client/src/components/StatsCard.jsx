// ─── StatsCard Component ──────────────────────────────────────────────────
// Displays task statistics in a row of cards at the top of the app

const StatsCard = ({ tasks }) => {
  // ── Calculate Statistics ──────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed).length;

  const activeTasks = tasks.filter((task) => !task.completed).length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }).length;

  // ── Stats Configuration Array ─────────────────────────────────────────
  // Each object defines one stat card's appearance and value
  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: "📋",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      valueColor: "text-blue-600",
    },
    {
      label: "Active",
      value: activeTasks,
      icon: "⚡",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-700",
      valueColor: "text-yellow-600",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: "✅",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      valueColor: "text-green-600",
    },
    {
      label: "Overdue",
      value: overdueTasks,
      icon: "🚨",
      bgColor: overdueTasks > 0 ? "bg-red-50" : "bg-gray-50",
      borderColor: overdueTasks > 0 ? "border-red-200" : "border-gray-200",
      textColor: overdueTasks > 0 ? "text-red-700" : "text-gray-500",
      valueColor: overdueTasks > 0 ? "text-red-600" : "text-gray-400",
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`
            ${stat.bgColor} ${stat.borderColor}
            border rounded-xl p-4
            transition-all duration-200
            hover:shadow-md
          `}
        >
          {/* Icon and Value Row */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xl">{stat.icon}</span>
            <span
              className={`
                text-2xl font-bold ${stat.valueColor}
              `}
            >
              {stat.value}
            </span>
          </div>

          {/* Label */}
          <p className={`text-sm font-medium ${stat.textColor}`}>
            {stat.label}
          </p>

          {/* Progress bar for completed tasks */}
          {stat.label === "Completed" && totalTasks > 0 && (
            <div className="mt-2">
              <div className="w-full bg-green-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      (completedTasks / totalTasks) * 100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-green-600 mt-1">
                {Math.round((completedTasks / totalTasks) * 100)}% done
              </p>
            </div>
          )}

          {/* Warning message for overdue tasks */}
          {stat.label === "Overdue" && overdueTasks > 0 && (
            <p className="text-xs text-red-500 mt-1">
              Needs attention!
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsCard;