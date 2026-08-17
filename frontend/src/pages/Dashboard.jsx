import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const { logout } = useAuth();

    const loadTasks = async () => {
        try {
            const response = await api.get("/tasks/");
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to load tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const addTask = async (e) => {
        e.preventDefault();

        if (!title.trim() || submitting) return;

        setSubmitting(true);
        try {
            await api.post("/tasks/", {
                title: title.trim(),
            });
            setTitle("");
            await loadTasks();
        } catch (error) {
            console.error("Failed to create task:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleTask = async (task) => {
        try {
            await api.patch(`/tasks/${task.id}/`, {
                is_completed: !task.is_completed,
            });
            await loadTasks();
        } catch (error) {
            console.error("Failed to toggle task:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}/`);
            await loadTasks();
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const activeTasks = tasks.filter((task) => !task.is_completed);
    const completedTasks = tasks.filter((task) => task.is_completed);

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-brand">
                    <h1 className="header-title">My Tasks</h1>
                    <span className="task-count-badge">
                        {activeTasks.length} active
                    </span>
                </div>
                <button className="btn-secondary logout-btn" onClick={logout}>
                    Logout
                </button>
            </header>

            <main className="main-content">
                <form className="task-form" onSubmit={addTask}>
                    <input
                        type="text"
                        className="task-input"
                        placeholder="What needs to be done?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="btn-primary add-btn"
                        disabled={!title.trim() || submitting}
                    >
                        {submitting ? "Adding..." : "Add Task"}
                    </button>
                </form>

                {loading ? (
                    <div className="state-container">
                        <p className="state-text">Loading tasks...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">✓</div>
                        <p className="empty-state-title">No tasks yet</p>
                        <p className="empty-state-subtitle">
                            Add a new task above to get started.
                        </p>
                    </div>
                ) : (
                    <div className="task-sections">
                        {/* Active Tasks Section */}
                        {activeTasks.length > 0 && (
                            <section className="task-section">
                                <h2 className="section-title">
                                    Active ({activeTasks.length})
                                </h2>
                                <ul className="task-list">
                                    {activeTasks.map((task) => (
                                        <li key={task.id} className="task-item">
                                            <label className="checkbox-container">
                                                <input
                                                    type="checkbox"
                                                    checked={task.is_completed}
                                                    onChange={() => toggleTask(task)}
                                                    className="task-checkbox"
                                                />
                                                <span className="custom-checkbox"></span>
                                            </label>

                                            <span
                                                className="task-title"
                                                onClick={() => toggleTask(task)}
                                            >
                                                {task.title}
                                            </span>

                                            <button
                                                className="btn-delete"
                                                onClick={() => deleteTask(task.id)}
                                                title="Delete task"
                                                aria-label="Delete task"
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Completed Tasks Section */}
                        {completedTasks.length > 0 && (
                            <section className="task-section completed-section">
                                <h2 className="section-title">
                                    Completed ({completedTasks.length})
                                </h2>
                                <ul className="task-list">
                                    {completedTasks.map((task) => (
                                        <li key={task.id} className="task-item completed-item">
                                            <label className="checkbox-container">
                                                <input
                                                    type="checkbox"
                                                    checked={task.is_completed}
                                                    onChange={() => toggleTask(task)}
                                                    className="task-checkbox"
                                                />
                                                <span className="custom-checkbox checked"></span>
                                            </label>

                                            <span
                                                className="task-title completed-title"
                                                onClick={() => toggleTask(task)}
                                                title="Click to mark active"
                                            >
                                                {task.title}
                                            </span>

                                            <button
                                                className="btn-delete"
                                                onClick={() => deleteTask(task.id)}
                                                title="Delete task"
                                                aria-label="Delete task"
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;