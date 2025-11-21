import { useState } from "react";
import "../../../styles/Dashboard/TasksCard.css";

const initialTasks = [
    { id: 1, label: "Finish report", completed: false },
    { id: 2, label: "Create new component", completed: false },
];

const TasksCard = () => {
    const [tasks, setTasks] = useState(initialTasks);

    const toggleTask = (id: number) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    };

    return (
        <div className="tasks-card shadow-sm">
            <h5 className="tasks-title">My tasks</h5>

            <ul className="tasks-list">
                {tasks.map((t) => (
                    <li key={t.id} className="task-row">
                        <label className="task-item">
                            <input
                                type="checkbox"
                                checked={t.completed}
                                onChange={() => toggleTask(t.id)}
                            />
                            <span className="checkbox-custom" />
                            <span className="task-text">{t.label}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TasksCard;