// src/components/common/Dashboard/ScheduleCard.tsx
import "../../../styles/Dashboard/ScheduleCard.css";
//*
import { useFetch} from '../../../hooks/useFetchGet';
import { useEffect, useState} from "react";  
import { useFetchSecond } from '../../../hooks/useFetchSecondGet';
import {useAuth} from "../../../authentication/AuthContext";
import NotFound from "../NotFound/NotFound.tsx";

interface Room {
    name: string;
    roomNumber?: string;
    // voeg hier eventueel andere velden toe als je ze later nodig hebt (capacity, etc.)
}

interface EventParticipation {
    id: number;
    userId: number;
    eventId: number;
    status: string;
    createdAt: string;
}

interface Evenement {
  id: number;
  title: string;
  description?: string;
  startsAt: string;
  endsAt: string;
  status: string;
  createdBy: number;
  deletedAt?: string | null;
  createdAt: string;
  room?: Room;
}

//*

const ScheduleOverviewCard = () => {
    //*
    const { user } = useAuth();
    const [eventParticipations, setEventParticipations] = useState<EventParticipation[]>([]);
    const [evenementen, setEvenementen] = useState<Evenement[]>([]);
    const { data, isLoading, error } = useFetch<Evenement[]>({ url: "/api/events" });
    const { data2, isLoading2, error2 } = useFetchSecond<EventParticipation[]>({ url: `/api/EventParticipations` });

    useEffect(() => {
        if (data) {
            setEvenementen(data);
        }
    }, [data]);

    useEffect(() => {
        if (data2) {
            setEventParticipations(data2);
        }
    }, [data2]);
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (isLoading2) return <p>Loading...</p>;
    if (error2) return <p>Error: {error2}</p>;
    if(user == null || user == undefined)
    {
        return <NotFound/>
    }
    const eventUserParticipations = eventParticipations.filter(e => e.userId == user.userId)
    const events = evenementen.filter(ev =>
        eventUserParticipations.some(ep => ep.eventId === ev.id)
    );
    const today = new Date();
    const items = events.filter(e => Number(e.startsAt.split("T")[0].split("-")[2]) == today.getDate() && Number(e.startsAt.split("T")[0].split("-")[0]) == today.getFullYear())
        .map(e => e.title);
    //*
    return (
        <div className="schedule-card">
            <h5 className="schedule-title">Today</h5>

            {items.length > 0 ? (
                <ul className="schedule-list">
                    {items.map((item) => (
                        <li key={item} className="schedule-item">
                            <span className="dot" />
                            <span className="text">{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events scheduled for today</p>
            )}
        </div>
    );
};

export default ScheduleOverviewCard;