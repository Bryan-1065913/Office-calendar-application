// src/components/common/Dashboard/WeekOverviewCard.tsx
import { useState, useEffect } from 'react';
import { workStatusService, type WorkStatus } from '../../../services/workStatusService';
import { useAuth } from '../../../authentication/AuthContext';
import '../../../styles/Dashboard/WeekOverviewCard.css';
import { StatusBadge } from './StatusBadge';
import ChevronIcon from "../../../assets/images/chevron.svg?react";

type Day = {
    wd: string;
    d: number;
    date: Date;
    chips?: string[];
    workStatus?: WorkStatus;
};

const WeekOverviewCard = () => {
    const { user } = useAuth();
    const [days, setDays] = useState<Day[]>([]);
    const [currentMonth, setCurrentMonth] = useState<string>('');
    const [currentYear, setCurrentYear] = useState<number>(0);
    const [currentWeekNumber, setCurrentWeekNumber] = useState<number>(0);
    const [weekOffset, setWeekOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            loadWeekData(weekOffset);
        } else {
            const weekDays = getWeekDays(weekOffset);
            setDays(weekDays);
            updateWeekInfo(weekDays);
        }
    }, [weekOffset, user]);

    const loadWeekData = async (offset: number) => {
        if (!user?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const monday = getMonday(offset);
            const weekDays = getWeekDays(offset);
            const startDateStr = monday.toISOString().split('T')[0];

            const statuses = await workStatusService.getWeekWorkStatus(startDateStr, user.id);

            const updatedDays = weekDays.map(day => {
                const dayStr = day.date.toISOString().split('T')[0];
                const status = statuses.find(s => s.date.split('T')[0] === dayStr);

                return {
                    ...day,
                    workStatus: status,
                    chips: status ? [mapStatusToLabel(status.status)] : []
                };
            });

            setDays(updatedDays);
            updateWeekInfo(weekDays);
        } catch (error: any) {
            console.error('Failed to load work status:', error);
            const weekDays = getWeekDays(offset);
            setDays(weekDays);
            updateWeekInfo(weekDays);
            setError('Kon werkstatus niet laden. Check console voor details.');
        } finally {
            setIsLoading(false);
        }
    };

    function updateWeekInfo(weekDays: Day[]) {
        if (weekDays.length > 0) {
            const firstDay = weekDays[0].date;
            setCurrentMonth(firstDay.toLocaleDateString('en-US', { month: 'long' }));
            setCurrentYear(firstDay.getFullYear());
            const currentWeek = getWeekNumber(firstDay);
            setCurrentWeekNumber(currentWeek);
        }
    }

    function getMonday(offset: number): Date {
        const today = new Date();
        const currentDay = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
        monday.setDate(monday.getDate() + (offset * 7));
        return monday;
    }

    function getWeekDays(offset: number): Day[] {
        const monday = getMonday(offset);
        const week: Day[] = [];
        const dagNamen = ['Mo', 'Tu', 'We', 'Th', 'Fr'];

        for (let i = 0; i < 5; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);

            week.push({
                wd: dagNamen[i],
                d: day.getDate(),
                date: day,
                chips: []
            });
        }

        return week;
    }

    function getWeekNumber(date: Date): number {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    function mapStatusToLabel(status: string): string {
        const statusMap: Record<string, string> = {
            'office': 'Office',
            'home': 'Home',
            'vacation': 'Leave',
            'sick': 'Sick',
            'business_trip': 'Business Trip',
            'other': 'Other'
        };
        return statusMap[status] || status;
    }

    // Map label → variant for StatusBadge
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

    const gaNaarVorigeWeek = () => setWeekOffset(prev => prev - 1);
    const gaNaarVolgendeWeek = () => setWeekOffset(prev => prev + 1);
    const gaNaarHuidigeWeek = () => setWeekOffset(0);

    return (
        <div className="week-overview-card card shadow-sm">
            <div className="week-overview-header d-flex justify-content-between align-items-center mb-2 px-1">
                <div className="d-flex align-items-center gap-2">
                    <button
                        className="week-nav-button btn btn-link p-0 text-decoration-none"
                        aria-label="Vorige week"
                        onClick={gaNaarVorigeWeek}
                        disabled={isLoading}
                    >
                        <ChevronIcon className="chevron chevron-left" />
                    </button>
                    <span className="week-label">
                        Week {currentWeekNumber > 0 ? currentWeekNumber - 1 : 52}
                    </span>
                </div>

                <h5 className="week-title" onClick={gaNaarHuidigeWeek}>
                    {currentMonth} {currentYear}
                </h5>

                <div className="d-flex align-items-center gap-2">
                    <span className="week-label">
                        Week {currentWeekNumber + 1}
                    </span>
                    <button
                        className="week-nav-button btn btn-link p-0 text-decoration-none"
                        aria-label="Volgende week"
                        onClick={gaNaarVolgendeWeek}
                        disabled={isLoading}
                    >
                        <ChevronIcon className="chevron chevron-right" />
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show mb-2" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Laden...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="week-days-grid text-center align-items-start">
                        {days.map(({ wd, d, date, chips }) => (
                            <div className="col day-item" key={date.toISOString()}>
                                <div className="day-name">{wd}</div>
                                <div className="day-number">{d}</div>

                                <div className="day-badges d-flex justify-content-center flex-wrap gap-2">
                                    {(chips ?? []).map((c) => (
                                        <StatusBadge
                                            key={c}
                                            label={c}
                                            variant={mapLabelToVariant(c)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default WeekOverviewCard;