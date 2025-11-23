import { useNavigate } from 'react-router';
import '/src/components/common/EventCards/EventCard.scss';
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
    StartsAt: string;
    StartsAtMonth: string;
    StartsAtYear:number;
    users: User[];
}

const EventCardRender = ({id, title, StartsAt, StartsAtMonth, StartsAtYear, CreatedBy, users} : EventCardProps) => {
    const datum = StartsAt.split("T")[0];
    const time = StartsAt.split("T")[1]
    const day = datum.split("-")[2];
    // navigation hook it works like the dom <link>
    const navigate = useNavigate();
    const createdUser = users.find(user => user.id === CreatedBy);
    return(
        <button className="button-event" onDoubleClick={() => {navigate(`/dashboard/events/${id}`)}}>
            <div key={id} className="event-card">
                <div className="event-container">
                    <h1 className="title">{title}</h1>
                    <h1 className="date">{day} {StartsAtMonth} {StartsAtYear}</h1> 
                    <h1 className="time-place">{time.split(":")[0]}:{time.split(":")[1]} - {}</h1>
                    {/* Showing id and title on the frontend*/}
                    {createdUser != null &&(
                    <p className="creator-fullName">Created By: {createdUser.firstName} {createdUser.lastName}</p>
                    )}
                </div>   
            </div>
        </button>
  );
};

export default EventCardRender;