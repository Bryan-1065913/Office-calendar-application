import '/src/components/common/Overzicht/Events.scss';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
interface Evenement {
  id?: number;
  name?: string;
  description?: string;
  date: string;
  place: string;
}

const evenementen: Evenement[] = [
  { id: 1, name: "evenement", description: "This is the description for event 1.", place: "rotterdam", date: "30/09/2026"},
  { id: 2, name: "evenement", description: "This is the description for event 2.", place: "online", date: "30/09/2026"},
  { id: 3, name: "evenement", description: "This is the description for event 3.", place: "online", date: "30/09/2026"},
  { id: 4, name: "evenement", description: "This is the description for event 4.", place: "online", date: "30/09/2026"},
  { id: 5, name: "evenement", description: "This is the description for event 5.", place: "online", date: "30/09/2026"},
  { id: 6, name: "evenement", description: "This is the description for event 6.", place: "online", date: "30/09/2026"},
  { id: 8, name: "evenement", description: "This is the description for event 8.", place: "online", date: "30/09/2026"},
  { id: 9, name: "evenement", description: "This is the description for event 9.", place: "online", date: "30/09/2026"},
  { id: 10, name: "evenement", description: "This is the description for event 10.", place: "online", date: "30/09/2026"}
];

const Events = () => {
  useEffect(() => {
          window.scrollTo(614, 614);
      });
  const navigate = useNavigate();

  const parsedDate = (dateStr:string) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  const now = new Date();

  return (
    <div>
      <header>
        <h1 className="table-title">Upcoming Events</h1>
      </header>

      <div className="table-wrapper">
        {evenementen.map(({ id, name, date}) => (
          parsedDate(date) > now && (
          <div key={id} className="event-card">
            <h1 className="event-id">{id}</h1>
            <h2 className="event-name">{name}</h2>
            <div className="event-details">
              <button onClick={() => {navigate(`/events/${id}`)}}>Details</button>
            </div>
          </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Events;
