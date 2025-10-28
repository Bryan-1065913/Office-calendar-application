// useParams hook
import { useParams } from 'react-router';
// importing the NotFound file
import NotFound from '../common/NotFound/NotFound';
// useState, useEffect hooks 
import { useState, useEffect } from 'react';
import '/src/components/events/EventDetail.scss';
// custom hook one
import { useFetch} from '../../hooks/useFetchGet';
// custom hook two
import { useFetchSecond } from '../../hooks/useFetchSecondGet';
// Defines the structure of an event object and its attributes
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
    // storage of evenementen using useState hook 
    const [evenementen, setEvenementen] = useState<Evenement[]>([]);
    // storage of User using another useState hook
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
    const { data2, isLoading2, error2 } = useFetchSecond<User[]>({ url: `http://localhost:5017/api/users/${id}` });
    // sets the Evenement array
    useEffect(() => {
        if (data) {
            setEvenementen(data);
        }
    }, [data]);
    // sets the User array
    useEffect(() => {
        if (data2) {
            setUsers(data2);
        }
    }, [data2]);
    // all 4 return the error JSX or Loading JSX
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (isLoading2) return <p>Loading...</p>;
    if (error2) return <p>Error: {error}</p>;

    //than we try to find a specific evenement with the id of useParams hook 
    const event = evenementen.find(e => e.id === Number(id));
    // we also get all users from useState() hook users hook
    const eventUsers = users;
    // and if an event is null or undifined it returns JSX notfound instead
    if(!event) {
        return <NotFound />;
    }
    // the function Returns JSX
    return (
        <div className="main">
            {/* this is a JSX snippet and what it does is if gebruikers hardcoded for now returns a button to join the event*/}
            {"gebruikers" === "gebruikers" && (
                <form>
                    <button type="submit" className="button-join">JOIN NOW !!!</button>
                </form>
            )}
            <div className="main-background">
                {/* same thing here but this time a panel on the right will be shown*/}
                { "gebruikers" === "gebruikers" && (
                <div className="gebruikers-main-users">
                    <div className="gebruikers-panel-users">
                        <table>
                            <thead>
                                <th className="gebruikers-th-id">ID</th>
                                <th className="gebruikers-th-name">NAME</th>
                            </thead>
                            {/* loops true all users and give bakc the id and lastname for the panel*/}
                            {eventUsers.map(({ id, lastName}) => (

                                <tbody className="gebruikers-paneel-Card-users">
                                    <tr>
                                        <td className="gebruikers-user-id">{id}</td>
                                        <td className="gebruikers-user-name">{lastName}</td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                </div>
                )}
                <div className="Border-line-event"></div>
                <div className="inner-event"></div>
                {/*event can be called cause it is just one event*/}
                <div key={event.id} className="main-card-event">
                    <h1 className="event-id-detail">{event.id}</h1>
                    <h2 className="event-name-detail">{event.title}</h2>
                    <div className="underscore-event"></div>
                    <p className="event-description-detail">{event.description}</p>
                    <p className="place-event">STATUS</p>
                    <div className="place-outer-event">
                        <div className="place-inner-event">
                            <p className="actual-place-event">{event.status}</p>
                        </div>
                    </div>
                    <p className="date-event">DATE</p>
                    <div className="date-outer-event">
                        <div className="date-inner-event">
                            <p className="actual-date-event">{event.startsAt.split("T")[0]}</p>
                        </div>
                    </div>
                </div>
                {/* only admins can enter here which is a panel on the left of all users that enrolled*/}
                { "ADMIN" === "ADMIN" && (
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
                )}
            </div>
        </div>
    );
};

export default Event;