import React, { useEffect, useState } from "react";

const defaultState = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: ""
};

const TaskForm = ({ onSubmit, initialData, onCancelEdit }) => {
  const [form, setForm] = useState(defaultState);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "todo",
        priority: initialData.priority || "medium",
        dueDate: initialData.dueDate
          ? initialData.dueDate.slice(0, 10)
          : ""
      });
    } else {
      setForm(defaultState);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const payload = {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate) : null
    };
    onSubmit(payload);
    if (!initialData) setForm(defaultState);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="label">Title</label>
        <input
          className="input"
          type="text"
          name="title"
          placeholder="e.g. Finish project proposal"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="label">Description</label>
        <textarea
          className="input"
          name="description"
          rows="3"
          style={{ borderRadius: 16, resize: "vertical" }}
          placeholder="Add some details to future you."
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="task-form-row">
        <div className="form-group">
          <label className="label">Status</label>
          <select
            className="input"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="form-group">
          <label className="label">Priority</label>
          <select
            className="input"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="label">Due date</label>
        <input
          className="input"
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: "flex", gap: "0.6rem" }}>
        <button className="button" type="submit">
          {initialData ? "Update task" : "Add task"}
        </button>

        {initialData && (
          <button
            type="button"
            className="button button-secondary"
            onClick={onCancelEdit}
          >
            Cancel edit
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
