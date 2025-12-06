// src/components/common/Tasks/Tasks.tsx
import { useAuth } from "../../../authentication/AuthContext";
import { useState, useEffect } from "react";
import "../../../styles/Task/Tasks.css";
import Button from "../UI/Buttons.tsx";
import { useFetch } from '../../../hooks/useFetchGet';
import Pen from "../../../assets/icons/pen.svg?react";
import TaskModal from "./TasksModal";

type TaskStatus = "today" | "upcoming" | "completed";

interface Task {
    id: number;
    userId: number;
    title: string;
    date: string | null;
    completed: boolean;
    status: TaskStatus;
}

const Tasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTab, setActiveTab] = useState<TaskStatus>("today");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
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

        setTasks(prev =>
            prev.map(t =>
                t.id === id ? { ...t, completed: updatedCompleted } : t
            )
        );

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
                setTasks(prev =>
                    prev.map(t =>
                        t.id === id ? { ...t, completed: !updatedCompleted } : t
                    )
                );
                console.error('Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            setTasks(prev =>
                prev.map(t =>
                    t.id === id ? { ...t, completed: !updatedCompleted } : t
                )
            );
        }
    };

    const handleEdit = (id: number) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            setEditingTask(task);
            setIsModalOpen(true);
        }
    };

    const handleAddTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleSaveTask = async (title: string, date: string | null) => {
        if (!user) {
            console.error('User not authenticated');
            return;
        }

        if (editingTask) {
            // Edit existing task
            try {
                const response = await fetch(`http://localhost:5017/api/tasks/${editingTask.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: editingTask.id,
                        userId: user.userId,
                        title: title,
                        dueDate: date,
                        completed: editingTask.completed
                    })
                });

                if (response.ok) {
                    const fetchResponse = await fetch('http://localhost:5017/api/tasks');
                    if (fetchResponse.ok) {
                        const updatedTasks = await fetchResponse.json();
                        setTasks(updatedTasks);
                    }
                } else {
                    const errorData = await response.json();
                    console.error('Failed to update task:', errorData);
                }
            } catch (error) {
                console.error('Error updating task:', error);
            }
        } else {
            // Create new task
            try {
                const response = await fetch('http://localhost:5017/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.userId,
                        title: title,
                        dueDate: date,
                        completed: false
                    })
                });

                if (response.ok) {
                    const fetchResponse = await fetch('http://localhost:5017/api/tasks');
                    if (fetchResponse.ok) {
                        const updatedTasks = await fetchResponse.json();
                        setTasks(updatedTasks);
                    }
                } else {
                    const errorData = await response.json();
                    console.error('Failed to create task:', errorData);
                }
            } catch (error) {
                console.error('Error creating task:', error);
            }
        }
    };

    const handleDeleteTask = async () => {
        if (!editingTask) return;

        try {
            const response = await fetch(`http://localhost:5017/api/tasks/${editingTask.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const fetchResponse = await fetch('http://localhost:5017/api/tasks');
                if (fetchResponse.ok) {
                    const updatedTasks = await fetchResponse.json();
                    setTasks(updatedTasks);
                }
            } else {
                const errorData = await response.json();
                console.error('Failed to delete task:', errorData);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const formatDate = (date: string | null): string | null => {
        if (!date) return null;
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const filteredTasks = tasks.filter(task => task.status === activeTab);

    const groupedByDate = filteredTasks.reduce((acc, task) => {
        const formattedDate = formatDate(task.date) || "No date";
        if (!acc[formattedDate]) {
            acc[formattedDate] = [];
        }
        acc[formattedDate].push(task);
        return acc;
    }, {} as Record<string, Task[]>);

    return (
        <>
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

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                onDelete={editingTask ? handleDeleteTask : undefined}
                initialTitle={editingTask?.title}
                initialDate={editingTask?.date}
                mode={editingTask ? "edit" : "create"}
            />
        </>
    );
};

export default Tasks;