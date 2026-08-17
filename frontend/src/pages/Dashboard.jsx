import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    const { logout } = useAuth();

    const loadTasks = async () => {
        const response = await api.get("/tasks/");
        setTasks(response.data);
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const addTask = async (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        await api.post("/tasks/", {
            title,
        });

        setTitle("");
        loadTasks();
    };

    const toggleTask = async (task) => {
        await api.patch(`/tasks/${task.id}/`, {
            is_completed: !task.is_completed,
        });

        loadTasks();
    };

    const deleteTask = async (id) => {
        await api.delete(`/tasks/${id}/`);
        loadTasks();
    };

    const activeTasks = tasks.filter(
        (task) => !task.is_completed
    );

    const completedTasks = tasks.filter(
        (task) => task.is_completed
    );

    return (
        <div className="dashboard">
            <header>
                <h1>My To-Do List</h1>

                <button onClick={logout}>
                    Logout
                </button>
            </header>

            <form onSubmit={addTask}>
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                />

                <button type="submit">
                    Add Task
                </button>
            </form>

            <section>
                <h2>Tasks</h2>

                {activeTasks.map((task) => (
                    <div key={task.id}>
                        <span
                            onClick={() =>
                                toggleTask(task)
                            }
                            style={{
                                cursor: "pointer",
                            }}
                        >
                            {task.title}
                        </span>

                        <button
                            onClick={() =>
                                deleteTask(task.id)
                            }
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </section>

            <section>
                <h2>Completed</h2>

                {completedTasks.map((task) => (
                    <div key={task.id}>
                        <span
                            onClick={() =>
                                toggleTask(task)
                            }
                            style={{
                                textDecoration:
                                    "line-through",
                                cursor: "pointer",
                            }}
                        >
                            {task.title}
                        </span>

                        <button
                            onClick={() =>
                                deleteTask(task.id)
                            }
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default Dashboard;