import React, { useEffect, useState, useMemo } from "react";
import api from "../api";
import { clearAuthData, getUser } from "../auth";
import { useNavigate } from "react-router-dom";
import TaskForm from "./TaskForm.jsx";
import TaskList from "./TaskList.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        clearAuthData();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    clearAuthData();
    navigate("/login");
  };

  const handleTaskCreateOrUpdate = async (data) => {
    if (editingTask) {
      const res = await api.put(`/tasks/${editingTask._id}`, data);
      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? res.data : t))
      );
      setEditingTask(null);
    } else {
      const res = await api.post("/tasks", data);
      setTasks((prev) => [res.data, ...prev]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const statusOK = statusFilter === "all" || t.status === statusFilter;
      const priorityOK =
        priorityFilter === "all" || t.priority === priorityFilter;
      return statusOK && priorityOK;
    });
  }, [tasks, statusFilter, priorityFilter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const done = tasks.filter((t) => t.status === "done").length;
    return { total, todo, inProgress, done };
  }, [tasks]);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">✦</div>
          <div>
            <div className="brand-text">FlowTasks</div>
            <div className="brand-tagline">Stay ahead. Stay organized.</div>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="sidebar-item active">
            <span>Dashboard</span>
            <span>⟶</span>
          </div>
          <div className="sidebar-item">
            <span>Upcoming</span>
            <span>🗓</span>
          </div>
          <div className="sidebar-item">
            <span>Completed</span>
            <span>✅</span>
          </div>
        </div>

        <div style={{ marginTop: "2rem", fontSize: "0.8rem" }}>
          <div className="card" style={{ padding: "0.8rem 0.9rem" }}>
            <div className="card-title">Today’s snapshot</div>
            <div className="chip-row">
              <span className="chip">Total: {stats.total}</span>
              <span className="chip">Todo: {stats.todo}</span>
              <span className="chip">In progress: {stats.inProgress}</span>
              <span className="chip">Done: {stats.done}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <div className="main-title-block">
            <h2 className="main-title">Hey {user?.name || "there"} 👋</h2>
            <p className="main-subtitle">
              Here’s your personal command center for tasks.
            </p>
          </div>
          <div className="user-pill">
            <div className="avatar">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div style={{ fontSize: "0.8rem" }}>
              <div>{user?.name}</div>
              <div style={{ color: "var(--muted)" }}>{user?.email}</div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="dashboard-grid">
          <section className="card">
            <h3 className="card-title">Quick add</h3>
            <p className="card-subtitle">
              Add a new task, or update an existing one. Keep things flowing.
            </p>
            <TaskForm
              onSubmit={handleTaskCreateOrUpdate}
              initialData={editingTask}
              onCancelEdit={() => setEditingTask(null)}
            />
          </section>

          <section className="card">
            <h3 className="card-title">Your tasks</h3>
            <p className="card-subtitle">
              Filter by status or priority to laser-focus your work.
            </p>

            <div className="filter-row">
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="todo">Todo</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>

              <select
                className="filter-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <TaskList
              tasks={filteredTasks}
              onEdit={(task) => setEditingTask(task)}
              onDelete={handleDelete}
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
