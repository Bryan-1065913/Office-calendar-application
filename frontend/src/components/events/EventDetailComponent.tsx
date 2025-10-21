import { useParams } from 'react-router';
import NotFound from '../common/NotFound/NotFound';
import { useState, useEffect } from 'react';
import '/src/components/events/EventDetail.scss';
import { useFetch} from '../../hooks/useFetchGet';
import { useFetchSecond } from '../../hooks/useFetchSecondGet';
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

const Event = () => {
    const [evenementen, setEvenementen] = useState<Evenement[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const { id } = useParams<{ id: string}>();
    useEffect(() => {
            window.scrollTo(610, 610);
    });
    const { data, isLoading, error } = useFetch<Evenement[]>({ url: "http://localhost:5017/api/events" });
    const { data2, isLoading2, error2 } = useFetchSecond<User[]>({ url: `http://localhost:5017/api/users/${id}` });
    useEffect(() => {
    if (data) {
        setEvenementen(data);
    }
    }, [data]);
    useEffect(() => {
    if (data2) {
        setUsers(data2);
    }
    }, [data2]);
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (isLoading2) return <p>Loading...</p>;
    if (error2) return <p>Error: {error}</p>;
    const event = evenementen.find(e => e.id === Number(id));
    const eventUsers = users;
    if(!event) {
        return <NotFound />;
    }
  return (
    <div className="main">
        {"gebruikers" === "gebruikers" && (
            <form>
                <button type="submit" className="button-join">JOIN NOW !!!</button>
            </form>
        )}
        <div className="main-background">
            { "gebruikers" === "gebruikers" && (
            <div className="gebruikers-main-users">
                <div className="gebruikers-panel-users">
                    <table>
                        <thead>
                            <th className="gebruikers-th-id">ID</th>
                            <th className="gebruikers-th-name">NAME</th>
                        </thead>
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