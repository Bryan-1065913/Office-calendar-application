// src/components/common/Dashboard/WeekOverviewCard.tsx
import {useState, useEffect} from 'react';
import { workStatusService, type WorkStatus } from '../../../services/workStatusService';
import { useAuth } from '../../../authentication/AuthContext';

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
    const [previousWeekNumber, setPreviousWeekNumber] = useState<number>(-1);
    const [nextWeekNumber, setNextWeekNumber] = useState<number>(1);
    const [weekOffset, setWeekOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            loadWeekData(weekOffset);
        } else {
            // Geen user ingelogd, toon lege week
            const weekDays = getWeekDays(weekOffset);
            setDays(weekDays);
            updateWeekInfo(weekDays);
        }
    }, [weekOffset, user]);

    const loadWeekData = async (offset: number) => {
        if (!user?.id) {
            console.log('No user logged in');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const monday = getMonday(offset);
            const weekDays = getWeekDays(offset);

            // Format date als "2025-11-11"
            const startDateStr = monday.toISOString().split('T')[0];

            console.log('Fetching work status for:', startDateStr, 'User:', user.id);

            // Haal work statuses op van de backend
            const statuses = await workStatusService.getWeekWorkStatus(startDateStr, user.id);

            console.log('Received statuses:', statuses);

            // Update dagen met de opgehaalde statuses
            const updatedDays = weekDays.map(day => {
                const dayStr = day.date.toISOString().split('T')[0];

                // ✅ FIX: Vergelijk datums zonder tijd
                const status = statuses.find(s => s.date.split('T')[0] === dayStr);

                console.log(`Day ${dayStr}:`, status ? 'Found status' : 'No status', status);

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
            console.error('Error details:', error.response?.data || error.message);
            setError('Kon werkstatus niet laden. Check console voor details.');
            const weekDays = getWeekDays(offset);
            setDays(weekDays);
            updateWeekInfo(weekDays);
        } finally {
            setIsLoading(false);
        }
    };

    function updateWeekInfo(weekDays: Day[]) {
        if (weekDays.length > 0) {
            const firstDay = weekDays[0].date;
            setCurrentMonth(firstDay.toLocaleDateString('nl-NL', {month: 'long'}));
            setCurrentYear(firstDay.getFullYear());

            const currentWeek = getWeekNumber(firstDay);
            setPreviousWeekNumber(currentWeek - 1);
            setNextWeekNumber(currentWeek + 1);
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
        const dagNamen = ['Ma', 'Di', 'Wo', 'Do', 'Vr'];

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
            'vacation': 'Free',
            'sick': 'Sick',
            'business_trip': 'Business Trip',
            'other': 'Other'
        };
        return statusMap[status] || status;
    }

    function getStatusColor(status: string): string {
        // Gebruik je originele kleuren!
        const colorMap: Record<string, string> = {
            'Office': 'bg-teal',      // Jouw custom class
            'Home': 'bg-lilac',       // Jouw custom class
            'Free': 'bg-platinum',    // Jouw custom class
            'Sick': 'bg-danger',
            'Business Trip': 'bg-info',
            'Other': 'bg-secondary'
        };
        return colorMap[status] || 'bg-secondary';
    }

    const gaNaarVorigeWeek = () => {
        setWeekOffset(prev => prev - 1);
    };

    const gaNaarVolgendeWeek = () => {
        setWeekOffset(prev => prev + 1);
    };

    const gaNaarHuidigeWeek = () => {
        setWeekOffset(0);
    };

    return (
        <div className="card p-3 shadow-sm">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                    <button
                        className="btn btn-link p-0"
                        aria-label="Vorige week"
                        onClick={gaNaarVorigeWeek}
                        disabled={isLoading}
                    >
                        <img src="/src/assets/images/angle-left.svg" width="24" height="24" alt=""/>
                    </button>
                    <span className="text-muted">week {previousWeekNumber}</span>
                </div>

                <h5 className="mb-0 fw-bold" style={{cursor: 'pointer'}} onClick={gaNaarHuidigeWeek}>
                    {currentMonth} {currentYear}
                </h5>

                <div className="d-flex align-items-center gap-2">
                    <span className="text-muted">week {nextWeekNumber}</span>
                    <button
                        className="btn btn-link p-0"
                        aria-label="Volgende week"
                        onClick={gaNaarVolgendeWeek}
                        disabled={isLoading}
                    >
                        <img
                            src="/src/assets/images/angle-left.svg"
                            width="24"
                            height="24"
                            alt=""
                            style={{transform: 'rotate(180deg)'}}
                        />
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Laden...</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="row row-cols-2 row-cols-md-5 text-center g-3 align-items-start mb-3">
                        {days.map(({wd, d, date, chips}) => (
                            <div className="col" key={date.toISOString()}>
                                <div className="fw-medium">{wd}</div>
                                <div className="fs-4 lh-1">{d}</div>
                                <div className="d-flex gap-2 justify-content-center flex-wrap mt-2">
                                    {(chips ?? []).map((c) => (
                                        <span
                                            key={c}
                                            className={`badge rounded-pill px-3 py-2 text-white ${getStatusColor(c)}`}
                                        >{c}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                        <button className="btn btn-calendar fw-bold flex-fill">
                            Nieuwe afspraak
                        </button>
                        <button className="btn btn-calendar fw-bold flex-fill">
                            Werkstatus toevoegen
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default WeekOverviewCard;