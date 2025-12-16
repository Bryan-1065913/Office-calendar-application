// src/components/common/Events/Events.tsx
import "../../../styles/Event/Events.css";
import { useState, useEffect, useMemo } from "react";
import { useFetch } from "../../../hooks/useFetchGet";
import { useFetchSecond } from "../../../hooks/useFetchSecondGet";
import EventCardRender from "./EventCard";
import Chevron from "../../../assets/icons/chevron.svg?react";
import '../../../assets/fonts/sen.css';

// Room interface toevoegen
interface Room {
    name: string;
    roomNumber?: string;
    // voeg hier eventueel andere velden toe als je ze later nodig hebt (capacity, etc.)
}

interface Event {
    id: number;
    title: string;
    startsAt: string;
    endsAt: string;
    createdBy: number;
    room?: Room; // <--- Room toegevoegd aan interface (optioneel met ?)
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
}

const API_BASE_URL = import.meta.env.VITE_API_API || "http://localhost:5017/api";

const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

const parseDate = (iso: string) => new Date(iso.split("T")[0]);
const isUpcoming = (iso: string) => parseDate(iso) >= new Date(new Date().setHours(0,0,0,0));

const Events = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const { data: events } = useFetch<Event[]>({ url: `${API_BASE_URL}/events` });
    const { data2: users } = useFetchSecond<User[]>({ url: `${API_BASE_URL}/users` });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const filteredEvents = useMemo(() => {
        if (!events) return [];
        const m = currentDate.getMonth();
        const y = currentDate.getFullYear();
        return events
            .filter(e => e.startsAt)
            .filter(e => {
                const d = parseDate(e.startsAt);
                return d.getMonth() === m && d.getFullYear() === y;
            });
    }, [events, currentDate]);

    const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    return (
        <div className="events-wrapper">
            <div className="events-card">

                <h1 className="events-title">Upcoming Events</h1>

                <div className="month-nav">
                    <button onClick={prevMonth} className="arrow-btn">
                        <Chevron className="chevron chevron-left" />
                    </button>
                    <span className="month-label">{MONTHS[month]} {year}</span>
                    <button onClick={nextMonth} className="arrow-btn">
                        <Chevron className="chevron chevron-right" />
                    </button>
                </div>

                <div className="events-list">
                    {filteredEvents.length === 0 ? (
                        <div className="no-events-wrapper">
                            <p className="no-events">No events this month</p>
                        </div>
                    ) : (
                        filteredEvents.map(e => (
                            <EventCardRender
                                key={e.id}
                                id={e.id}
                                title={e.title}
                                StartsAt={e.startsAt}
                                EndsAt={e.endsAt}
                                StartsAtMonth={MONTHS[month]}
                                StartsAtYear={year}
                                CreatedBy={e.createdBy}
                                users={users ?? []}
                                room={e.room}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Events;