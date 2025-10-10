// src/components/common/Dashboard/WeekOverviewCard.tsx
import { useState, useEffect } from 'react';

type Day = {
    wd: string;
    d: number;
    date: Date;
    chips?: string[]
};

const WeekOverviewCard = () => {
    const [days, setDays] = useState<Day[]>([]);
    const [currentMonth, setCurrentMonth] = useState<string>('');
    const [currentYear, setCurrentYear] = useState<number>(0);
    const [weekNumber, setWeekNumber] = useState<number>(0);
    const [weekOffset, setWeekOffset] = useState<number>(0); // 0 = huidige week, -1 = vorige week, +1 = volgende week

    useEffect(() => {
        const weekDays = getWeekDays(weekOffset);
        setDays(weekDays);

        // Haal maand en jaar van de eerste dag van de week
        if (weekDays.length > 0) {
            const firstDay = weekDays[0].date;
            setCurrentMonth(firstDay.toLocaleDateString('nl-NL', { month: 'long' }));
            setCurrentYear(firstDay.getFullYear());
            setWeekNumber(getWeekNumber(firstDay));
        }
    }, [weekOffset]);

    function getWeekDays(offset: number): Day[] {
        const today = new Date();
        const currentDay = today.getDay();
        const week: Day[] = [];

        // Start vanaf maandag
        const monday = new Date(today);
        monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

        // Pas offset toe (7 dagen per week)
        monday.setDate(monday.getDate() + (offset * 7));

        // Genereer 5 werkdagen (maandag t/m vrijdag)
        const dagNamen = ['Ma', 'Di', 'Wo', 'Do', 'Vr'];

        for (let i = 0; i < 5; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);

            week.push({
                wd: dagNamen[i],
                d: day.getDate(),
                date: day,
                chips: getChipsForDay(day)
            });
        }

        return week;
    }

    // Helper functie om weeknummer te berekenen
    function getWeekNumber(date: Date): number {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    // Placeholder functie - later kun je hier je echte data ophalen van backend
    function getChipsForDay(date: Date): string[] {
        const dayOfWeek = date.getDay();

        if (dayOfWeek === 1 || dayOfWeek === 4) return ["Kantoor"];
        if (dayOfWeek === 2) return ["Vrij"];
        if (dayOfWeek === 3 || dayOfWeek === 5) return ["Thuiswerken"];

        return [];
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
                <button
                    className="btn btn-link p-0"
                    aria-label="Vorige week"
                    onClick={gaNaarVorigeWeek}
                >
                    <img src="/src/assets/images/angle-left.svg" width="24" height="24" alt=""/>
                </button>

                <h5 className="mb-0 fw-bold" style={{ cursor: 'pointer' }} onClick={gaNaarHuidigeWeek}>
                    {currentMonth} {currentYear}
                </h5>

                <div className="d-flex align-items-center gap-2">
                    <span className="text-muted">week {weekNumber}</span>
                    <button
                        className="btn btn-link p-0"
                        aria-label="Volgende week"
                        onClick={gaNaarVolgendeWeek}
                    >
                        <img
                            src="/src/assets/images/angle-left.svg"
                            width="24"
                            height="24"
                            alt=""
                            style={{ transform: 'rotate(180deg)' }}
                        />
                    </button>
                </div>
            </div>

            <div className="row row-cols-2 row-cols-md-5 text-center g-3 align-items-start mb-3">
                {days.map(({wd, d, date, chips}) => (
                    <div className="col" key={date.toISOString()}>
                        <div className="fw-medium">{wd}</div>
                        <div className="fs-4 lh-1">{d}</div>
                        <div className="d-flex gap-2 justify-content-center flex-wrap mt-2">
                            {(chips ?? []).map((c) => (
                                <span
                                    key={c}
                                    className={`badge rounded-pill px-3 py-2 text-white ${
                                        c === "Kantoor" ? "bg-teal" :
                                            c === "Thuiswerken" ? "bg-lilac" :
                                                c === "Vrij" ? "bg-platinum" :
                                                    "bg-secondary"
                                    }`}
                                >{c}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-calendar fw-bold flex-fill">Nieuwe afspraak toevoegen
                </button>
                <button className="btn btn-calendar fw-bold flex-fill" data-bs-toggle="modal"
                        data-bs-target="#exampleModal">Activiteit toevoegen
                </button>
            </div>
        </div>
    );
};

export default WeekOverviewCard;