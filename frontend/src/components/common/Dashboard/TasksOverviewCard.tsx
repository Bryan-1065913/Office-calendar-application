// src/components/common/Dashboard/TasksOverviewCard.tsx
import { useState, useEffect } from "react";
import "../../../styles/Dashboard/TasksCard.css";
import { useFetch } from '../../../hooks/useFetchGet';

interface Task {
    id: number;
    userId: number;
    title: string;
    date: string | null;
    completed: boolean;
    status: string;
}

const TasksOverviewCard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { data, isLoading, error } = useFetch<Task[]>({ url: "http://localhost:5017/api/tasks" });

    useEffect(() => {
        if (data) {
            const today = new Date().toISOString().split('T')[0];

            const todayTasks = data.filter(task => {
                if (task.status === "today") return true;

                if (task.status === "completed" && task.date === today) return true;

                if (task.status === "completed" && !task.date) return true;

                return false;
            });

            setTasks(todayTasks);
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

    if (isLoading) return <div className="tasks-overview-card"><p>Loading...</p></div>;
    if (error) return <div className="tasks-overview-card"><p>Error: {error}</p></div>;

    return (
        <div className="tasks-overview-card">
            <h5 className="tasks-overview-title">My tasks</h5>

            {tasks.length === 0 ? (
                <p className="no-tasks-overview">No tasks for today</p>
            ) : (
                <ul className="tasks-overview-list">
                    {tasks.map((t) => (
                        <li key={t.id} className="task-overview-row">
                            <label className="task-overview-item">
                                <input
                                    type="checkbox"
                                    checked={t.completed}
                                    onChange={() => toggleTask(t.id)}
                                />
                                <span className="checkbox-custom" />
                                <span className={`task-overview-text ${t.completed ? 'completed' : ''}`}>
                                    {t.title}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TasksOverviewCard;