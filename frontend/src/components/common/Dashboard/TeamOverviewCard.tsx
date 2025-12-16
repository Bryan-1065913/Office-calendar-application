// src/components/common/Dashboard/TeamOverviewCard.tsx
import "../../../styles/Dashboard/TeamOverviewCard.css";
import { useEffect, useMemo, useState } from "react";
import { useFetchSecond } from "../../../hooks/useFetchSecondGet";
import { workStatusService, type WorkStatus } from "../../../services/workStatusService";
import { StatusBadge } from "../UI/StatusBadge";

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
        business_trip: "Other",
        other: "Other"
    };
    return map[status] || status;
}

function mapStatusBadgeVariant(status: string | null): "office" | "home" | "leave" | "sick" | "off" {
    if (!status) return "off";
    switch (status) {
        case "home":
            return "home";
        case "vacation":
            return "leave";
        case "sick":
            return "sick";
        case "business_trip":
            return "off";
        default:
            return "office";
    }
}

const TeamOverviewCard = () => {
    const [dayStatuses, setDayStatuses] = useState<WorkStatus[]>([]);

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

    return (
        <div className="team-card">
            <h5 className="team-title">Team</h5>

            {isLoading2 && <p>Loading team...</p>}
            {error2 && <p>Error loading team: {error2}</p>}

            <div className="team-grid">
                {users?.slice(0, 3).map((u) => {
                    const status = getStatusForUser(u.id);
                    const label = status ? mapStatusLabel(status) : "No status";
                    const badgeVariant = mapStatusBadgeVariant(status);

                    return (
                        <div key={u.id} className="team-row">
                            <div className="avatar" />
                            <span className="name">
                                {u.firstName} {u.lastName}
                            </span>

                            <div className="status">
                                <StatusBadge label={label} variant={badgeVariant} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamOverviewCard;