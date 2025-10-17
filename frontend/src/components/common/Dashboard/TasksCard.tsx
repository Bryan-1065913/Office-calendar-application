// src/components/common/Dashboard/TasksCard.tsx
const TasksCard = () => {
    return (
        <div className="card p-3 shadow-sm">
            <h6 className="fw-bold">Mijn taken</h6>
            <div>
                <input type="checkbox" id="scales" name="scales" className="me-2"/>
                <label htmlFor="scales">Verslag afmaken</label>
            </div>
        </div>
    );
};

export default TasksCard;