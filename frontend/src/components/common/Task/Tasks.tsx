// src/components/common/Tasks/Tasks.tsx
import { useState, useEffect } from "react";
import "../../../styles/Task/Tasks.css";
import Button from "../UI/Buttons.tsx";
import { useFetch } from '../../../hooks/useFetchGet';
import Pen from "../../../assets/icons/pen.svg?react";

type TaskStatus = "today" | "upcoming" | "completed";

interface Task {
    id: number;
    userId: number;
    title: string;
    date: string | null; // Format: "yyyy-MM-dd" van backend
    completed: boolean;
    status: TaskStatus; // Wordt berekend door backend
}

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTab, setActiveTab] = useState<TaskStatus>("today");
    const { data, isLoading, error } = useFetch<Task[]>({ url: "http://localhost:5017/api/tasks" });

    useEffect(() => {
        if (data) {
            setTasks(data);
        }
    }, [data]);

    const toggleTask = async (id: number) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const updatedCompleted = !task.completed;

        // Optimistic update
        setTasks(prev =>
            prev.map(t =>
                t.id === id ? { ...t, completed: updatedCompleted } : t
            )
        );

        // Update naar backend
        try {
            const response = await fetch(`http://localhost:5017/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: task.id,
                    userId: task.userId,
                    title: task.title,
                    dueDate: task.date,
                    completed: updatedCompleted,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            });

            if (!response.ok) {
                // Rollback bij fout
                setTasks(prev =>
                    prev.map(t =>
                        t.id === id ? { ...t, completed: !updatedCompleted } : t
                    )
                );
                console.error('Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            // Rollback
            setTasks(prev =>
                prev.map(t =>
                    t.id === id ? { ...t, completed: !updatedCompleted } : t
                )
            );
        }
    };

    const handleEdit = (id: number) => {
        console.log("Edit task:", id);
        // Implementeer edit functionaliteit hier
    };

    const handleAddTask = () => {
        console.log("Add new task");
        // Implementeer add task functionaliteit hier
    };

    // Format date from yyyy-MM-dd to dd-MM-yyyy
    const formatDate = (date: string | null): string | null => {
        if (!date) return null;
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const filteredTasks = tasks.filter(task => task.status === activeTab);

    // Groepeer tasks per datum voor upcoming en completed
    const groupedByDate = filteredTasks.reduce((acc, task) => {
        const formattedDate = formatDate(task.date) || "No date";
        if (!acc[formattedDate]) {
            acc[formattedDate] = [];
        }
        acc[formattedDate].push(task);
        return acc;
    }, {} as Record<string, Task[]>);

    return (
        <div className="tasks-card">
            <div className="tasks-header">
                <h3 className="tasks-title">Tasks</h3>
                <Button onClick={handleAddTask}>Add new task</Button>
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
                {filteredTasks.length === 0 ? (
                    <p className="no-tasks">No tasks found</p>
                ) : activeTab === "today" ? (
                    <ul className="tasks-list">
                        {filteredTasks.map((task) => (
                            <li key={task.id} className="task-row">
                                <label className="task-item">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTask(task.id)}
                                    />
                                    <span className="checkbox-custom" />
                                    <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                                        {task.title}
                                    </span>
                                </label>
                                <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(task.id)}
                                >
                                    <Pen className="pen" />
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
                                    <li key={task.id} className="task-row">
                                        <label className="task-item">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => toggleTask(task.id)}
                                            />
                                            <span className="checkbox-custom" />
                                            <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                                                {task.title}
                                            </span>
                                        </label>
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(task.id)}
                                        >
                                            <Pen className="pen" />
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

export default Tasks;