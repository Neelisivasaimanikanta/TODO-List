import React from "react";

const TaskList = ({ tasks, onEdit, onDelete }) => {
  if (!tasks.length)
    return (
      <div style={{ marginTop: "0.8rem", fontSize: "0.85rem" }}>
        No tasks yet. Add your first one on the left ✨
      </div>
    );

  const formatDate = (dateStr) => {
    if (!dateStr) return "No due date";
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div className="task-item" key={task._id}>
          <div className="task-main">
            <div className="task-title">{task.title}</div>
            {task.description && (
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--muted)",
                  maxWidth: "420px"
                }}
              >
                {task.description}
              </div>
            )}

            <div className="task-meta">
              <span className={`badge status-${task.status}`}>
                {task.status === "todo"
                  ? "Todo"
                  : task.status === "in-progress"
                  ? "In progress"
                  : "Done"}
              </span>
              <span className={`badge priority-${task.priority}`}>
                Priority: {task.priority}
              </span>
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>
          </div>

          <div className="task-actions">
            <button
              className="icon-btn"
              type="button"
              onClick={() => onEdit(task)}
            >
              ✏️ Edit
            </button>
            <button
              className="icon-btn delete"
              type="button"
              onClick={() => onDelete(task._id)}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
