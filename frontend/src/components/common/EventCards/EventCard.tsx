import { useNavigate } from "react-router";
import "../../../styles/Event/EventCard.css";

interface User {
    id: number;
    firstName: string;
    lastName: string;
}

interface Room {
    name: string;
    roomNumber?: string;
}

interface EventCardProps {
    id: number;
    title: string;
    StartsAt: string;
    EndsAt?: string; // Optioneel maken voor als er geen eindtijd is
    StartsAtMonth: string;
    StartsAtYear: number;
    CreatedBy: number;
    users: User[];
    room?: Room; // Optioneel omdat een event misschien geen kamer heeft
}

export default function EventCardRender({
                                            id,
                                            title,
                                            StartsAt,
                                            EndsAt,
                                            StartsAtMonth,
                                            StartsAtYear,
                                            room
                                        }: EventCardProps) {

    const navigate = useNavigate();

    // Parse start tijd
    const [startDatePart, startTimePart] = StartsAt.split("T");
    const day = startDatePart.split("-")[2];
    const startTime = startTimePart.slice(0, 5);

    // Parse eind tijd (als het bestaat)
    const endTime = EndsAt ? EndsAt.split("T")[1].slice(0, 5) : startTime;

    return (
        <div
            className="event-card-wrapper"
            onDoubleClick={() => navigate(`/events/${id}`)}
        >
            <div className="event-card-image"></div>

            <div className="event-card-content">
                <h3 className="event-title">{title}</h3>

                <p className="event-date">
                    {day} {StartsAtMonth.toLowerCase()} {StartsAtYear}
                </p>

                <p className="event-time">
                    {startTime} – {endTime}
                </p>

                <p className="event-location">
                    {room ? room.name : "Locatie onbekend"}
                </p>
            </div>
        </div>
    );
}