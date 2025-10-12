// src/components/common/Dashboard/ActivityModal.tsx
import { useState, useEffect } from 'react';

type Planning = {
    [key: string]: string;
};

interface ActivityModalProps {
    onSave?: (planning: Planning) => void;
}

const ActivityModal = ({ onSave }: ActivityModalProps) => {
    const [weekDays, setWeekDays] = useState<Date[]>([]);
    const [planning, setPlanning] = useState<Planning>({});

    const activityOptions = [
        { value: '', label: 'Type activiteit' },
        { value: 'kantoor', label: 'Kantoor' },
        { value: 'thuis', label: 'Thuiswerken' },
        { value: 'vrij', label: 'Vrij' },
        { value: 'ziek', label: 'Ziek' },
        { value: 'vakantie', label: 'Vakantie' },
        { value: 'overig', label: 'Overig' }
    ];

    useEffect(() => {
        const days = getWeekDays();
        setWeekDays(days);

        const initPlanning: Planning = {};
        days.forEach(day => {
            initPlanning[day.toISOString()] = '';
        });
        setPlanning(initPlanning);
    }, []);

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

    const handleChange = (dayKey: string, waarde: string) => {
        setPlanning(prev => ({
            ...prev,
            [dayKey]: waarde
        }));
    };

    const handleSubmit = () => {
        console.log('Planning voor de week:', planning);
        if (onSave) {
            onSave(planning);
        }
    };

    return (
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Add activity</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
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
                                            value={planning[dayKey] || ''}
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
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-calendar fw-bold flex-fill"
                            onClick={handleSubmit}
                            data-bs-dismiss="modal"
                        >
                            Save activity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityModal;