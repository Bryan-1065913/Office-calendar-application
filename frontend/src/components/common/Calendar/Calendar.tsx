import { useState, useEffect } from "react";
import { useAuth } from "../../../authentication/AuthContext";
import { workStatusService, type WorkStatus } from "../../../services/workStatusService";
import { StatusBadge } from "../UI/StatusBadge";
import Chevron from "../../../assets/icons/chevron.svg?react";
import "../../../styles/Calendar/Calendar.css";
import Button from "../UI/Buttons.tsx";

interface DayCell {
    date: Date | null;
    day: number | null;
    weekday: string;
    isCurrentMonth: boolean;
    chips?: string[];
    workStatus?: WorkStatus;
}

const Calendar = () => {
    const { user } = useAuth();
    const [month, setMonth] = useState(new Date());
    const [days, setDays] = useState<DayCell[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.userId) return;
        loadMonth();

        // Luister naar refresh events van modal saves
        const handleRefresh = () => {
            console.log("🔄 Calendar refresh triggered");
            loadMonth();
        };

        window.addEventListener('calendarRefresh', handleRefresh);
        return () => window.removeEventListener('calendarRefresh', handleRefresh);
    }, [month, user]);

    function getWeekdayLabel(date: Date) {
        const map = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        return map[date.getDay()];
    }

    const loadMonth = async () => {
        if (!user?.userId) return;

        try {
            setError(null);

            const year = month.getFullYear();
            const m = month.getMonth();

            const first = new Date(year, m, 1);
            const last = new Date(year, m + 1, 0);

            const startDateStr = `${first.getFullYear()}-${String(first.getMonth() + 1).padStart(2, "0")}-01`;

            const statuses = await workStatusService.getMonthWorkStatus(startDateStr, user.userId);
            const allDays: DayCell[] = [];

            const weekday = first.getDay() === 0 ? 7 : first.getDay();
            const pad = weekday - 1;

            for (let i = 0; i < pad; i++) {
                allDays.push({
                    date: null,
                    day: null,
                    weekday: "",
                    isCurrentMonth: false,
                    chips: []
                });
            }

            for (let d = 1; d <= last.getDate(); d++) {
                const dateObj = new Date(year, m, d);
                const iso = formatDate(dateObj);
                const status = statuses.find(s => s.date.startsWith(iso));

                allDays.push({
                    date: dateObj,
                    day: d,
                    weekday: getWeekdayLabel(dateObj),
                    isCurrentMonth: true,
                    chips: status ? [mapStatusLabel(status.status)] : []
                });
            }

            setDays(allDays);
        } catch (err: any) {
            setError("Kon kalenderdata niet laden.");
            console.error(err);
        }
    };

    function formatDate(date: Date) {
        return date.toLocaleDateString("sv-SE");
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

    function mapLabelToVariant(label: string): 'off' | 'sick' | 'home' | 'leave' | 'office' {
        const map: Record<string, any> = {
            "Off": "off",
            "Sick": "sick",
            "Home": "home",
            "Leave": "leave",
            "Office": "office"
        };
        return map[label] || "office";
    }

    const prevMonth = () =>
        setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));

    const nextMonth = () =>
        setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));

    return (
        <div className="week-overview-card">
            <div className="week-overview-header d-flex justify-content-between align-items-center mb-2 px-1">
                <button className="week-nav-button btn btn-link p-0" onClick={prevMonth}>
                    <Chevron className="chevron chevron-left" />
                </button>

                <h5 className="week-title">
                    {month.toLocaleDateString("en-US", { month: "long" })} {month.getFullYear()}
                </h5>

                <button className="week-nav-button btn btn-link p-0" onClick={nextMonth}>
                    <Chevron className="chevron chevron-right" />
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="week-days-grid calendar-grid">
                {days.map((day, i) => (
                    <div key={i} className={`day-item ${!day.isCurrentMonth ? "empty" : ""}`}>
                        {day.isCurrentMonth && (
                            <>
                                <div className="day-name">{day.weekday}</div>
                                <div className="day-number">{day.day}</div>

                                <div className="day-badges d-flex justify-content-center flex-wrap gap-2">
                                    {(day.chips ?? []).map(chip => (
                                        <StatusBadge
                                            key={chip}
                                            label={chip}
                                            variant={mapLabelToVariant(chip)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="button-row d-flex justify-content-end mt-3">
                <Button
                    data-bs-toggle="modal"
                    data-bs-target="#calendarModal"
                >
                    Aanwezigheid toevoegen
                </Button>
            </div>
        </div>
    );
};

export default Calendar;