import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";

// ─── TaskList Component ───────────────────────────────────────────────────
// Renders all task cards with drag and drop reordering support

const TaskList = ({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onDragEnd,
  isLoading,
  currentFilter,
  searchQuery,
}) => {
  // ── Loading State ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        {/* Spinner */}
        <div className="spinner mb-4" />
        <p className="text-gray-500 text-sm">Loading your tasks...</p>
      </div>
    );
  }

  // ── Empty State ───────────────────────────────────────────────────────
  if (tasks.length === 0) {
    // Different messages based on context
    const getEmptyMessage = () => {
      if (searchQuery) {
        return {
          icon: "🔍",
          title: `No tasks found for "${searchQuery}"`,
          subtitle: "Try a different search term",
        };
      }
      if (currentFilter === "completed") {
        return {
          icon: "✅",
          title: "No completed tasks yet",
          subtitle: "Complete a task to see it here",
        };
      }
      if (currentFilter === "active") {
        return {
          icon: "⚡",
          title: "No active tasks",
          subtitle: "All tasks are completed! Great job! 🎉",
        };
      }
      if (currentFilter === "overdue") {
        return {
          icon: "🎉",
          title: "No overdue tasks",
          subtitle: "You are all caught up!",
        };
      }
      return {
        icon: "📋",
        title: "No tasks found",
        subtitle: "Create your first task to get started!",
      };
    };

    const emptyMessage = getEmptyMessage();

    return (
      <div className="
        flex flex-col items-center justify-center
        py-16 text-center
      ">
        {/* Empty State Icon */}
        <div className="
          text-6xl mb-4
          animate-bounce
        ">
          {emptyMessage.icon}
        </div>

        {/* Empty State Title */}
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {emptyMessage.title}
        </h3>

        {/* Empty State Subtitle */}
        <p className="text-sm text-gray-400 max-w-xs">
          {emptyMessage.subtitle}
        </p>

        {/* Show hint only when no tasks exist at all */}
        {currentFilter === "all" && !searchQuery && (
          <div className="
            mt-6 px-4 py-3
            bg-blue-50 border border-blue-200
            rounded-lg max-w-xs
          ">
            <p className="text-xs text-blue-600">
              💡 <strong>Tip:</strong> Click the form above
              to add your first task!
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── Render Task List With Drag and Drop ───────────────────────────────
  return (
    <div>
      {/* Task Count Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-700">
            {tasks.length}
          </span>{" "}
          task{tasks.length !== 1 ? "s" : ""}
          {searchQuery && (
            <span className="text-blue-600">
              {" "}matching "{searchQuery}"
            </span>
          )}
        </p>

        {/* Drag hint */}
        <p className="text-xs text-gray-400 hidden md:block">
          ⠿ Drag to reorder
        </p>
      </div>

      {/* ── Drag and Drop Context ── */}
      {/* DragDropContext wraps everything that can be dragged */}
      <DragDropContext onDragEnd={onDragEnd}>

        {/* Droppable defines the area where items can be dropped */}
        <Droppable droppableId="task-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`
                min-h-20 rounded-xl transition-colors duration-200
                ${snapshot.isDraggingOver
                  ? "bg-blue-50 border-2 border-dashed border-blue-300 p-2"
                  : ""}
              `}
            >
              {/* Render each task as a Draggable item */}
              {tasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {/* TaskItem Component */}
                      <TaskItem
                        task={task}
                        onToggle={onToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}

              {/* Required by react-beautiful-dnd */}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;