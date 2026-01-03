// src/components/common/Events/Events.tsx
import "../../../styles/Event/Events.css";
import { useState, useEffect, useMemo } from "react";
import { useFetch } from "../../../hooks/useFetchGet";
import { useFetchSecond } from "../../../hooks/useFetchSecondGet";
import EventCardRender from "./EventCard";
import EventForm from "../EventForm/EventForm";
import Chevron from "../../../assets/icons/chevron.svg?react";
import { useAuth } from "../../../authentication/AuthContext";
import '../../../assets/fonts/sen.css';
import NotFound from "../NotFound/NotFound";

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
    const { user } = useAuth();
    if(!user)
    {
        return <NotFound/>
    }
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showEventForm, setShowEventForm] = useState(false);

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
            {showEventForm && user.role === "admin" ? (
                <div className="events-card">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <h1 className="events-title" style={{ margin: 0 }}>
                            Create New Event
                        </h1>
                        <button
                            onClick={() => setShowEventForm(false)}
                            className="close-form-btn"
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: "32px",
                                cursor: "pointer",
                                color: "var(--gunmetal)",
                                fontWeight: "bold",
                                padding: "0 10px",
                            }}
                        >
                            ×
                        </button>
                    </div>

                    <EventForm
                        embedded
                        onSuccess={() => {
                            setShowEventForm(false);
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        }}
                        onCancel={() => setShowEventForm(false)}
                    />
                </div>
            ) : (
                <div className="events-card">
                    {user.role === "admin" && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px",
                            }}
                        >
                            <h1 className="events-title" style={{ margin: 0 }}>
                                Upcoming Events
                            </h1>

                            <button
                                onClick={() => setShowEventForm(true)}
                                className="add-event-btn"
                                style={{
                                    background: "var(--tiffany)",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "50px",
                                    height: "50px",
                                    fontSize: "32px",
                                    cursor: "pointer",
                                    color: "white",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.1)";
                                    e.currentTarget.style.boxShadow =
                                        "0 4px 8px rgba(0,0,0,0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow =
                                        "0 2px 4px rgba(0,0,0,0.2)";
                                }}
                            >
                                +
                            </button>
                        </div>
                    )}

                    <div className="month-nav">
                        <button onClick={prevMonth} className="arrow-btn">
                            <Chevron className="chevron chevron-left" />
                        </button>
                        <span className="month-label">
                            {MONTHS[month]} {year}
                        </span>
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
                            filteredEvents.map((e) => (
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
            )}
        </div>
    );
};

export default Events;