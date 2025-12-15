import "../../../styles/Dashboard/TeamPage.css";
import { useEffect, useMemo, useState } from "react";
import { useFetchSecond } from "../../../hooks/useFetchSecondGet";
import { workStatusService, type WorkStatus } from "../../../services/workStatusService";
import Calendar from "../Calendar/Calendar";

interface User {
    id: number;
    firstName: string;
    lastName: string;
}

const API_BASE_URL = import.meta.env.VITE_API_API || "http://localhost:5017/api";

function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
}

function mapStatusLabel(status: string) {
    const map: Record<string, string> = {
        office: "Office",
        home: "Home",
        vacation: "Leave",
        sick: "Sick",
        business_trip: "Business Trip",
        other: "Other"
    };
    return map[status] || status;
}

function mapStatusDotClass(status: string): "office" | "home" | "leave" | "sick" {
    switch (status) {
        case "home":
            return "home";
        case "vacation":
            return "leave";
        case "sick":
            return "sick";
        default:
            return "office";
    }
}

const Team = () => {
    const [dayStatuses, setDayStatuses] = useState<WorkStatus[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const today = useMemo(() => formatDate(new Date()), []);

    const { data2: users, isLoading2, error2 } = useFetchSecond<User[]>({
        url: `${API_BASE_URL}/users`
    });

    useEffect(() => {
        const loadStatuses = async () => {
            try {
                const result = await workStatusService.getDayWorkStatus(today);
                setDayStatuses(result);
            } catch (e) {
                console.error("Failed to load day work status", e);
            }
        };

        loadStatuses();
    }, [today]);

    const getStatusForUser = (userId: number) => {
        const status = dayStatuses.find(s => s.userId === userId);
        return status ? status.status : null;
    };

    const handleSelectUser = (userId: number) => {
        setSelectedUserId(userId);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (isLoading2) return <p>Loading team...</p>;
    if (error2) return <p>Error loading team: {error2}</p>;

    // No user selected: show full-width team overview
    if (!selectedUserId) {
        return (
            <div className="team-page">
                <div className="team-card">
                    <h2 className="team-title">Team</h2>

                    <div className="team-grid">
                        {users?.map((u) => {
                            const status = getStatusForUser(u.id);
                            const label = status ? mapStatusLabel(status) : "No status";
                            const dotClass = status ? mapStatusDotClass(status) : "office";

                            return (
                                <button
                                    key={u.id}
                                    className="team-row team-row-clickable"
                                    type="button"
                                    onClick={() => handleSelectUser(u.id)}
                                >
                                    <div className="avatar" />
                                    <span className="name">
                                        {u.firstName} {u.lastName}
                                    </span>

                                    <div className="status">
                                        <span className={`dot ${dotClass}`} />
                                        <span className="status-text">{label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // User selected: show full-width calendar with back button
    return (
        <div className="team-page">
            <button
                type="button"
                className="back-to-team"
                onClick={() => setSelectedUserId(null)}
            >
                &lt; Back to team
            </button>
            <Calendar viewUserId={selectedUserId} />
        </div>
    );
};

export default Team;


