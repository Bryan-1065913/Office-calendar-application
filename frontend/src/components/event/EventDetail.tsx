// useParams hook
import { useParams } from 'react-router';
// importing the NotFound file
import NotFound from '../common/NotFound/NotFound';
// useState, useEffect hooks 
import { useState, useEffect } from 'react';
import '/src/components/event/EventDetail.scss';
// custom hook one
import { useFetch} from '../../hooks/useFetchGet';
// custom hook two
import { useFetchSecond } from '../../hooks/useFetchSecondGet';
import {useFetchThird} from '../../hooks/useFetchThird';
import { Navigate } from "react-router";
// Defines the structure of an event object and its attributes
import { useAuth } from "../../authentication/AuthContext";
import Aanwezigen from '../common/aanwezigen/aanwezigen';

interface Evenement {
  id: number;
  title: string;
  description?: string;
  startsAt: string;
  status: string;
  createdBy: number;
  deletedAt?: string | null;
  createdAt: string;
}
interface EventParticipation {
    id: number;
    userId: number;
    eventId: number;
    status: string;
    createdAt: string;
}
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

// Event componenet
const Event = () => {
    const { user } = useAuth();
    // storage of evenementen using useState hook 
    const [evenementen, setEvenementen] = useState<Evenement[]>([]);
    const [buttonEvent, setButtonEvent] = useState<boolean>(false);
    // storage of User using another useState hook
    const [eventParticipations, setEventParticipations] = useState<EventParticipation[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    // useParams hook takes the id in this case thats being given in the parameter
    const { id } = useParams<{ id: string}>();
     // this has its own space of stuff happening such as fetch
    useEffect(() => {
        //scrolls to a certain place of the webpage
        window.scrollTo(610, 610);
    });// because of no []dependency array it renders everytime the component renders 
    // for example with f5

    // we are using 2 custom hooks cause we cant use the same one twice
    // because of you would overwrite data, isloading and error
    const { data, isLoading, error } = useFetch<Evenement[]>({ url: "http://localhost:5017/api/events" });
    const { data2, isLoading2, error2 } = useFetchSecond<EventParticipation[]>({ url: `http://localhost:5017/api/EventParticipations` });
    const { data3, isLoading3, error3 } = useFetchThird<User[]>({ url: `http://localhost:5017/api/users` });
    // sets the Evenement array
    useEffect(() => {
        if (data) {
            setEvenementen(data);
        }
    }, [data]);
    // sets the User array
    useEffect(() => {
        if (data2) {
            setEventParticipations(data2);
        }
    }, [data2]);
    useEffect(() => {
        if (data3) {
            setUsers(data3);
        }
    }, [data3]);
    // all 4 return the error JSX or Loading JSX
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (isLoading2) return <p>Loading...</p>;
    if (error2) return <p>Error: {error2}</p>;
    if (isLoading3) return <p>Loading...</p>;
    if (error3) return <p>Error: {error3}</p>;

    //than we try to find a specific evenement with the id of useParams hook 
    const event = evenementen.find(e => e.id === Number(id));

    // and if an event is null or undifined it returns JSX notfound instead
    if(!event) {
        return <NotFound />;
    }
    // we also get all users from useState() hook users hook
    if(user == null )
    {
        return <Navigate to="/login" replace />;
    }
    const EventParticipation = eventParticipations.filter(ep => ep.eventId === event.id && ep.status == "joined");
    const eventUsers = users.filter(u =>  EventParticipation.some( ep => ep.userId === u.id ));
    const eventUserId = eventParticipations.some( ep => ep.userId === user.id && event.id === ep.eventId && ep.status == "joined");
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
                    eventId:  event.id,
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
            const response = await fetch(`http://localhost:5017/api/EventParticipations/${user.id}/${event.id}`, {
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

    const monthNames: string[] = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    // the function Returns JSX
    return (
        <div className="main-background">
            {/*event can be called cause it is just one event*/}
            <div key={event.id} className="main-card-event">
                <header className="event-title">
                    <h2 className="event-title-content">{event.title}</h2>
                </header>
                <section className="event-all-content">
                    <p className="event-date-content"><img src="/src/assets/images/calendar.svg" alt="Logo" width="33.6" height="36" /> {event.startsAt.split("T")[0].split("-")[2]}  {monthNames[Number(event.startsAt.split("T")[0].split("-")[1]) - 1]}  {event.startsAt.split("T")[0].split("-")[0]} </p>
                    <p className="event-time-content"><img src="/src/assets/images/clock.svg" alt="Logo" width="33.6" height="36" /> {event.startsAt.split("T")[1].split(":")[0]}:{event.startsAt.split("T")[1].split(":")[1]} - </p>
                    <p className="event-location-content"><img src="/src/assets/images/location.svg" alt="Logo" width="33.6" height="36" /></p>
                </section>
                <p className="event-description">{event.description}</p>
                { user.id !== event.createdBy && ( 
                    <div className="user-button">
                        <button className="edit-button" onClick={() => {setButtonEvent(true);}}>{!eventUserId ? "Join" : "Decline"}</button>
                    </div>
                )}
                <section className="attendees-content">
                    <p className="attendees">Attendees</p> 
                    <div className="attendees-overzicht">
                        <Aanwezigen eventUsers={eventUsers} />  
                    </div>
                </section>
            </div>
            {buttonEvent &&(
                <div className="pop-up">
                    {!eventUserId && (
                        <p className="Description">do you really want to Join the event: {event.title}</p>
                    )}
                    {eventUserId && (
                        <p className="Description"> do you really want to Leave the event: {event.title}</p>
                    )}    
                    <div className="middleware">
                        {/* user != null && user.role === "user" && eventUsers.some(u => u.id !== user.id */}
                        {/* this is a JSX snippet and what it does is if gebruikers hardcoded for now returns a button to join the event*/}
                        { user != null && user.role === "user" && !eventUserId && (
                            <form className="form-join-event" >
                                <button type="submit" className="button-join" onClick={() => {
                                    joinButtonHandler(); setButtonEvent(false);}}>Join</button>
                                <button type="submit" className="button-cancel" onClick={() => {
                                    joinButtonHandler(); setButtonEvent(false);}}>Cancel</button>
                            </form>
                        )}
                        { user != null && user.role === "user" && eventUserId && (
                            <form className="form-decline-event" >
                                <button type="submit" className="button-decline" onClick={() => {
                                    declineButtonHandler(); setButtonEvent(false)}}>Decline</button>
                                <button type="submit" className="button-cancel" onClick={() => {
                                    setButtonEvent(false)}}>Cancel</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
            {/* only admins can enter here which is a panel on the left of all users that enrolled*/}
            {/* { user != null && user.role === "admin" &&(
            <div className="main-users">
                <div className="admin-panel-users">
                    <table>
                        <thead>
                            <th className="th-id">ID</th>
                            <th className="th-name">NAME</th>
                        </thead>
                        {eventUsers.map(({ id, lastName}) => (

                            <tbody className="paneel-Card-users">
                                <tr>
                                    <td className="user-id">{id}</td>
                                    <td className="user-name">{lastName}</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
            )} */}
        </div>
    );
};

export default Event;