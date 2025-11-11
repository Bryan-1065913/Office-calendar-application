// src/components/common/Dashboard/TasksCard.tsx
const TasksCard = () => {
    return (
        <div className="card p-3 shadow-sm">
            <h6 className="fw-bold">My tasks</h6>
            <div>
                <input type="checkbox" id="scales" name="scales" className="me-2"/>
                <label htmlFor="scales">Finish report</label>
            </div>
        </div>
    );
};

export default TasksCard;