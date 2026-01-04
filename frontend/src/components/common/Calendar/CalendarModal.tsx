// src/components/common/Dashboard/CalendarModal.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../../authentication/AuthContext';
import { workStatusService } from '../../../services/workStatusService';

type PlanningWithIds = {
    [key: string]: {
        status: string;
        id?: number; // 👈 Voeg ID toe
    };
};

interface ActivityModalProps {
    onSave?: (planning: PlanningWithIds) => void; // 👈 Update type
}

const CalendarModal = ({ onSave }: ActivityModalProps) => {
    const { user } = useAuth();
    const [weekDays, setWeekDays] = useState<Date[]>([]);
    const [planning, setPlanning] = useState<PlanningWithIds>({}); // 👈 Update type
    const [loading, setLoading] = useState(false);

    const activityOptions = [
        { value: '', label: 'Type of activity' },
        { value: 'office', label: 'Office' },
        { value: 'home', label: 'Home' },
        { value: 'day off', label: 'Day off' },
        { value: 'sick', label: 'Sick' },
        { value: 'holiday', label: 'Holiday' },
        { value: 'other', label: 'Other' }
    ];

    useEffect(() => {
        const days = getWeekDays();
        setWeekDays(days);

        // Initialize empty planning
        const initPlanning: PlanningWithIds = {};
        days.forEach(day => {
            initPlanning[day.toISOString()] = { status: '', id: undefined };
        });
        setPlanning(initPlanning);
    }, []);

    // Load existing work status when modal opens
    useEffect(() => {
        const modalElement = document.getElementById('calendarModal');

        const handleModalShow = async () => {
            if (!user?.userId || weekDays.length === 0) return;
            await loadExistingStatus();
        };

        modalElement?.addEventListener('show.bs.modal', handleModalShow);

        return () => {
            modalElement?.removeEventListener('show.bs.modal', handleModalShow);
        };
    }, [user, weekDays]);

    function getWeekDays(): Date[] {
        const today = new Date();
        const currentDay = today.getDay();
        const week: Date[] = [];

        const monday = new Date(today);
        monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

        for (let i = 0; i < 5; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            week.push(day);
        }

        return week;
    }

    function formatDate(date: Date): string {
        return date.toLocaleDateString("sv-SE"); // yyyy-mm-dd
    }

    // Map backend status naar dropdown value
    function mapBackendStatusToDropdown(status: string): string {
        const map: Record<string, string> = {
            'office': 'office',
            'home': 'home',
            'vacation': 'holiday',
            'sick': 'sick',
            'business_trip': 'other',
            'other': 'other'
        };
        return map[status] || '';
    }

    const loadExistingStatus = async () => {
        if (!user?.userId || weekDays.length === 0) return;

        try {
            setLoading(true);

            const startDate = formatDate(weekDays[0]);
            console.log("📥 Loading existing status for week starting:", startDate);

            const existingStatuses = await workStatusService.getWeekWorkStatus(startDate, user.userId);

            console.log("📊 Existing statuses:", existingStatuses);

            // Map existing statuses to planning WITH IDs
            const updatedPlanning: PlanningWithIds = { ...planning };

            existingStatuses.forEach(status => {
                const matchingDay = weekDays.find(day => {
                    const dayStr = formatDate(day);
                    return status.date.startsWith(dayStr);
                });

                if (matchingDay) {
                    const dayKey = matchingDay.toISOString();
                    updatedPlanning[dayKey] = {
                        status: mapBackendStatusToDropdown(status.status),
                        id: status.id // 👈 Sla de ID op!
                    };
                }
            });

            setPlanning(updatedPlanning);
            console.log("✅ Planning loaded:", updatedPlanning);

        } catch (error) {
            console.error("❌ Error loading existing status:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (dayKey: string, waarde: string) => {
        setPlanning(prev => ({
            ...prev,
            [dayKey]: {
                ...prev[dayKey],
                status: waarde
            }
        }));
    };

    const handleSubmit = () => {
        console.log('Planning voor de week:', planning);
        if (onSave) {
            onSave(planning);
        }
    };

    return (
        <div className="modal fade" id="calendarModal" tabIndex={-1} aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div className="modal-dialog modal-md">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Add activity</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <form>
                                {weekDays.map((day) => {
                                    const dayKey = day.toISOString();
                                    return (
                                        <div key={dayKey} className="mb-3">
                                            <label className="form-label fw-bold">
                                                {day.toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long'
                                                })}
                                            </label>
                                            <select
                                                className="form-select"
                                                value={planning[dayKey]?.status || ''}
                                                onChange={(e) => handleChange(dayKey, e.target.value)}
                                            >
                                                {activityOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                })}
                            </form>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-calendar fw-bold flex-fill"
                            onClick={handleSubmit}
                            data-bs-dismiss="modal"
                            disabled={loading}
                        >
                            Save activity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;