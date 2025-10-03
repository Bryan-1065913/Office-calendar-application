import { useParams } from 'react-router';
import NotFound from '../common/NotFound/NotFound';
import { useEffect } from 'react';
import '/src/components/events/EventDetail.scss';
interface Evenement {
  id?: number;
  name?: string;
  description?: string;
  date: string;
  place: string;
  users: User[];

}

interface User {
    id?: number;
    name: string;
}
const users: User[] = [
    {id: 1, name: "sdfgrtgrfeasdf"},
    {id: 2, name: "sdfgrtgrfeasf"},
    {id: 3, name: "sdfgrtgrfewaefa"},
    {id: 4, name: "sdfgrtgrfewef"},
    {id: 5, name: "sdfgrtgrfeafawe"},
    {id: 6, name: "sdfgrtgrfeqwef"},
    {id: 7, name: "sdfgrtgrfeg"},
    {id: 8, name: "sdfgrtgrfewf"},
    {id: 9, name: "sdfgrtgrfedsfa"},
    {id: 10, name: "sdfgrtgrfesfd"},
    {id: 11, name: "sdfgrtgrfeadf"},
    {id: 12, name: "sdfgrtgrfeaasdff"},
    {id: 13, name: "sdfgrtgrfetrg"},
    {id: 14, name: "sdfgrtgrfeg"},
    {id: 15, name: "sdfgrtgrfeuik"},
    {id: 16, name: "sdfgrtgrfeytjhr"},
    {id: 17, name: "sdfgrtgrfergree"},
    {id: 18, name: "sdfgrtgrfeerg"}
]
interface User {
    id?: number;
    name: string;
}
const evenementen: Evenement[] = [
  { id: 1, name: "evenement", description: "This is the description for event 1.", place: "rotterdam", date: "30/09/2025", users: [users[0], users[1], users[2]] },
  { id: 2, name: "evenement", description: "This is the description for event 2.", place: "online", date: "30/09/2025", users: [users[3], users[4], users[5]]},
  { id: 3, name: "evenement", description: "This is the description for event 3.", place: "online", date: "30/09/2025", users: [users[6], users[7], users[8]]},
  { id: 4, name: "evenement", description: "This is the description for event 4.", place: "online", date: "30/09/2025", users: [users[9], users[10], users[11]]},
  { id: 5, name: "evenement", description: "This is the description for event 5.", place: "online", date: "30/09/2025", users: [users[12], users[13], users[14]]},
  { id: 6, name: "evenement", description: "This is the description for event 6.", place: "online", date: "30/09/2025", users: [users[15], users[16], users[17]]},
  { id: 8, name: "evenement", description: "This is the description for event 8.", place: "online", date: "30/09/2025", users: [users[0], users[1], users[2]]},
  { id: 9, name: "evenement", description: "This is the description for event 9.", place: "online", date: "30/09/2025", users: []},
  { id: 10, name: "evenement", description: "This is the description for event 10.", place: "online", date: "30/09/2025", users: []}
];



const Event = () => {
    useEffect(() => {
            window.scrollTo(610, 610);
        });
    const { id } = useParams<{ id: string}>();
    const event = evenementen.find(e => e.id === Number(id));
    if(!event) {
        return <NotFound />;
    }
  return (
    <div className="main">
        <div className="Border-line-event"></div>
        <div className="inner-event"></div>
        <div key={event.id} className="main-card-event">
            <h1 className="event-id-detail">{event.id}</h1>
            <h2 className="event-name-detail">{event.name}</h2>
            <div className="underscore-event"></div>
            <p className="event-description-detail">{event.description}</p>
            <p className="place-event">PLACE</p>
            <div className="place-outer-event">
                <div className="place-inner-event">
                    <p className="actual-place-event">{event.place}</p>
                </div>
            </div>
            <p className="date-event">DATE</p>
            <div className="date-outer-event">
                <div className="date-inner-event">
                    <p className="actual-date-event">{event.date}</p>
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
                    {event.users.map(({ id, name }) => (

                        <tbody className="paneel-Card-users">
                            <tr>
                                <td className="user-id">{id}</td>
                                <td className="user-name">{name}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
        </div>
        )}
    </div>
  );
};

export default Event;