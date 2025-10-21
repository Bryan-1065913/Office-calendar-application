import '/src/components/common/Overzicht/Events.scss';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import {useFetch} from '../../../hooks/useFetchGet';

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



const Events = () => {
  const [evenementen, setEvenementen] = useState<Evenement[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
          window.scrollTo(614, 614);
          
      });
  const { data, isLoading, error } = useFetch<Evenement[]>({ url: "http://localhost:5017/api/events" });
  useEffect(() => {
    if (data) {
      setEvenementen(data);
    }
  }, [data]);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const now = new Date();
  const parsedDate = (dateStr:string) => {
    dateStr = dateStr.split('T')[0]; // "dd/mm/yyyy"
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  console.log(evenementen);
  const upcomingevents = evenementen.filter(events => events.startsAt === undefined ? false : parsedDate(events.startsAt) > now);

  return (
    <div>
      <header>
        <h1 className="table-title">Upcoming Events</h1>
      </header>

      <div className="table-wrapper">
        {upcomingevents.map(({ id, title}) => (
          <div key={id} className="event-card">
            <h1 className="event-id">{id}</h1>
            <h2 className="event-name">{title}</h2>
            <div className="event-details">
              <button onClick={() => {navigate(`/events/${id}`)}}>Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
