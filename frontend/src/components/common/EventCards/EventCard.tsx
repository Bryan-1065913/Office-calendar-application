import { useNavigate } from 'react-router';

interface EventCardProps {
    id: number;
    title: string;
}

const EventCardRender = ({id, title} : EventCardProps) => {
    // navigation hook it works like the dom <link>
    const navigate = useNavigate();
    return(
        <div key={id} className="event-card">
            {/* Showing id and title on the frontend*/}
            <h1 className="event-id">{id}</h1>
            <h2 className="event-name">{title}</h2>
            <div className="event-details">
            {/* navigates you to a new page with an id */}
            <button onClick={() => {navigate(`/events/${id}`)}}>Details</button>
            </div>
        </div>
  );
};

export default EventCardRender;