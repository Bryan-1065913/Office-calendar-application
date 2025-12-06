// src/components/common/Tasks/Tasks.tsx
import { useState } from "react";
import "../../../styles/Task/Tasks.css";

type TaskStatus = "today" | "upcoming" | "completed";

interface Task {
    id: number;
    label: string;
    status: TaskStatus;
    date?: string; // Voor upcoming en completed tasks
    completed: boolean;
}

const initialTasks: Task[] = [
    { id: 1, label: "Finish report", status: "today", completed: false },
    { id: 2, label: "Create new component", status: "today", completed: false },
    { id: 3, label: "Call client", status: "upcoming", date: "19-11-2025", completed: false },
    { id: 4, label: "Send mail to colleague", status: "upcoming", date: "19-11-2025", completed: false },
    { id: 5, label: "Call client", status: "completed", date: "15-11-2025", completed: true },
    { id: 6, label: "Send mail to colleague", status: "completed", date: "15-11-2025", completed: true },
];

const TasksOverviewCard = () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeTab, setActiveTab] = useState<TaskStatus>("today");

    const toggleTask = (id: number) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    };

    const handleEdit = (id: number) => {
        console.log("Edit task:", id);
        // Implementeer edit functionaliteit hier
    };

    const handleAddTask = () => {
        console.log("Add new task");
        // Implementeer add task functionaliteit hier
    };

    const filteredTasks = tasks.filter(task => task.status === activeTab);

    // Groepeer tasks per datum voor upcoming en completed
    const groupedByDate = filteredTasks.reduce((acc, task) => {
        const date = task.date || "no-date";
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(task);
        return acc;
    }, {} as Record<string, Task[]>);

    return (
        <div className="tasks-card">
            <div className="tasks-header">
                <h3 className="tasks-title">Tasks</h3>
                <button className="add-task-btn" onClick={handleAddTask}>
                    Add new task
                </button>
            </div>

            <div className="tasks-tabs">
                <button
                    className={`tab ${activeTab === "today" ? "active" : ""}`}
                    onClick={() => setActiveTab("today")}
                >
                    Today
                </button>
                <button
                    className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
                    onClick={() => setActiveTab("upcoming")}
                >
                    Upcoming
                </button>
                <button
                    className={`tab ${activeTab === "completed" ? "active" : ""}`}
                    onClick={() => setActiveTab("completed")}
                >
                    Completed
                </button>
            </div>

            <div className="tasks-content">
                {activeTab === "today" ? (
                    <ul className="tasks-list">
                        {filteredTasks.map((task) => (
                            <li key={task.id} className="task-item">
                                <label className="task-label">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTask(task.id)}
                                    />
                                    <span className="task-text">{task.label}</span>
                                </label>
                                <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(task.id)}
                                >
                                    ✏️
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    Object.entries(groupedByDate).map(([date, tasksForDate]) => (
                        <div key={date} className="tasks-date-group">
                            <h4 className="task-date">{date}</h4>
                            <ul className="tasks-list">
                                {tasksForDate.map((task) => (
                                    <li key={task.id} className="task-item">
                                        <label className="task-label">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => toggleTask(task.id)}
                                                disabled={activeTab === "completed"}
                                            />
                                            <span className="task-text">{task.label}</span>
                                        </label>
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(task.id)}
                                        >
                                            ✏️
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TasksOverviewCard;