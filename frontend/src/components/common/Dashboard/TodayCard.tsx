// src/components/common/Dashboard/TodayCard.tsx
const TodayCard = () => {
    return (
        <div className="card p-3 shadow-sm">
            <h5 className="fw-bold mb-3">Today</h5>
            <ul className="custom-bullets mb-0">
                <li>Kick-off meeting</li>
                <li>Project update</li>
                <li>Corporate training</li>
            </ul>
        </div>
    );
};

export default TodayCard;