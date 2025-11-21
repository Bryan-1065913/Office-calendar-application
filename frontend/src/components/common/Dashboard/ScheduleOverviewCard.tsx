// src/components/common/Dashboard/ScheduleCard.tsx
import "../../../styles/Dashboard/ScheduleCard.css";

const ScheduleOverviewCard = () => {
    const items = [
        "Kick-off meeting",
        "Project update",
        "Corporate training"
    ];

    return (
        <div className="schedule-card">
            <h5 className="schedule-title">Today</h5>

            <ul className="schedule-list">
                {items.map((item) => (
                    <li key={item} className="schedule-item">
                        <span className="dot" />
                        <span className="text">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ScheduleOverviewCard;