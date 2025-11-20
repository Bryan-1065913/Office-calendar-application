import { useNavigate } from 'react-router';
import {useEffect, useState} from 'react';
import '/src/components/common/EventCards/EventCard.scss';
import {useAuth} from '../../../authentication/AuthContext'
import NotFound from '../NotFound/NotFound';
import { useFetchSecond } from '../../../hooks/useFetchSecondGet';
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

interface EventParticipation {
    id: number;
    userId: number;
    eventId: number;
    status: string;
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
    const {user} = useAuth();
    if(!user)
    {
        return <NotFound/>
    }
    const [eventParticipations, setEventParticipations] = useState<EventParticipation[]>([]);
    const datum = StartsAt.split("T")[0];
    const time = StartsAt.split("T")[1]
    const day = datum.split("-")[2];
    const { data2, isLoading2, error2 } = useFetchSecond<EventParticipation[]>({ url: `http://localhost:5017/api/EventParticipations` });
    
    const eventUserId = eventParticipations.some( ep => ep.userId === user.id && id === ep.eventId && ep.status == "joined");

    // navigation hook it works like the dom <link>
    const navigate = useNavigate();
    useEffect(() => {
        if (data2) {
            setEventParticipations(data2);
        }
    }, [data2]);
    if (isLoading2) return <p>Loading...</p>;
    if (error2) return <p>Error: {error2}</p>;
    const createdUser = users.find(user => user.id === CreatedBy);

    const joinButtonHandler = async () => {
        try
        {
            const response = await fetch("http://localhost:5017/api/EventParticipations/", {
                method: 'POST',
                headers : {
                     'content-type' : 'application/json',


                },
                body: JSON.stringify({
                    userId: user.id, // hardcoded for now
                    eventId: id,
                    status: "joined"
                }),
            });
            if (response.ok) {
                console.log("Successfully joined event");
            }
        }
        catch (error)
        {
            console.log("Error:", error);
        }        
    };

    const declineButtonHandler = async () => {
        try
        {
            const response = await fetch(`http://localhost:5017/api/EventParticipations/${user.id}/${id}`, {
                method: 'DELETE',
                headers : {
                     'content-type' : 'application/json',


                },
            });
            if (response.ok) {
                console.log("Successfully declined event");
            }
        }
        catch (error)
        {
            console.log("Error:", error);
        }        
    };

    return(
        <button className="button-event" onDoubleClick={() => 
            {
                if(user != null && user.role === "user" && !eventUserId)
                { 
                    joinButtonHandler(); 
                    navigate(`/events/${id}`);
                }
                else
                {
                    navigate(`/events/${id}`);
                }
            }} onClick={() => 
                {
                    if(user != null && user.role === "user" && eventUserId)
                    {
                        declineButtonHandler(); 
                        navigate(`/events/${id}`);
                    }
                }
            }>
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