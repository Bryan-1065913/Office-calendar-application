import { useNavigate } from 'react-router';

// Defines the structure of an User object and its attributes
interface User {
    id: number;
    companyId: number;
    departmentId: number;
    workplaceId: number;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    phoneNumber: string;
    jobTitle: string;
    role: string;
    createdAt: string;
}

interface EventCardProps {
    id: number;
    title: string;
    CreatedBy: number;
    users: User[];
    eventId: number;
}

const EventCardRender = ({id, title, CreatedBy, users, eventId} : EventCardProps) => {
    // navigation hook it works like the dom <link>
    const navigate = useNavigate();
    const createdUser = users.find(user => user.id === CreatedBy);
    return(
        <div key={id} className="event-card">
            {/* Showing id and title on the frontend*/}
            <h1 className="event-id">{eventId}</h1>
            <h2 className="event-name">{title}</h2>
            {createdUser != null &&(
            
            <p className="creator-fullName">Created By: {createdUser.firstName} {createdUser.lastName}</p>
            )}   
            <div className="event-details">
                {/* navigates you to a new page with an id */}
                <button onClick={() => {navigate(`/events/${id}`)}}>Details</button>
            </div>
        </div>
  );
};

export default EventCardRender;