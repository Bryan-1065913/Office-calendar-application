import '/src/components/common/Overzicht/Events.scss';
// useState and useEffect hooks
import { useState, useEffect } from 'react';
// useFetch custom hook
import {useFetch} from '../../../hooks/useFetchGet';
// custom hook two
import { useFetchSecond } from '../../../hooks/useFetchSecondGet';
import EventCardRender from '../EventCards/EventCard'

class EventCounter
{
    static count = 0;
    id: number;
    constructor() {
        EventCounter.count++;
        this.id = EventCounter.count;
    }
}

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
// Events component
const Events = () => {
  // this is a hook that lets you store in this case an Evenement
  //It works like an getter and setter in c#
  const [evenementen, setEvenementen] = useState<Evenement[]>([]);
  const [monthNumber, setMonthNumber] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [userList, setUserList] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  
  // this is using the custom hook to fetch data from the api which is connected to the database
  // data returns the data that is being fetched
  // if data takes long than isLoading is happening which is returned from the hook
  // and if you get an error data nor isLoading is being done instead error comes in place
  const { data, isLoading, error } = useFetch<Evenement[]>({ url: "http://localhost:5017/api/events" });
  
  const { data2, isLoading2, error2 } = useFetchSecond<User[]>({ url: `http://localhost:5017/api/users` });
  // sets the User array
  //this useEffect hook is  using dependency array
  // which means when it is returned it does not load agian
  useEffect(() => {
    if (data) {
      // the useState hook is being set with data from the custom hook if it exists ofcourse
      setEvenementen(data);
    }
  }, [data]);
  useEffect(() => {
    if (data2) {
        setUserList(data2);
    }
  }, [data2]);
  // this has its own space of stuff happening such as fetch
  useEffect(() => {
    //scrolls to a certain place of the webpage
    window.scrollTo(614, 1014);
          
  });// because of no []dependency array it renders everytime the component renders 
  // for example with f5
  // if isLoading is true it returns jsx so the user knows that the page is loading
  if (isLoading) return <p>Loading...</p>;
  // if error is true it returns jsx so the user knows about the error
  if (error) return <p>Error: {error}</p>;  
  // all 4 return the error JSX or Loading JSX
  if (isLoading2) return <p>Loading...</p>;
  if (error2) return <p>Error: {error2}</p>;
  
  // new data is being made here;
  const now = new Date();
  //this is a function that returns a new data object from a string 
  const parsedDate = (dateStr:string) => {
    // since in the database the  data is being saved with an T between the data and time so we have to split it
    dateStr = dateStr.split('T')[0]; // "dd/mm/yyyy"
    // here year month and dat are being saved from the split and being made number
    const [year, month, day] = dateStr.split("-").map(Number);
    // returns an new Date based on year month and day stored before
    return new Date(year, month - 1, day);
  }
  const itemPerPage = 6;
  // this filters all evenementen based on if thier startsAt which is of type datetime is undifined'
  // than we have a ternaty operator which says if its true ignore the event else a new date is being parsed and checked if its greater is than now which is of type datetime
  const upcomingevents = evenementen.filter(events => events.startsAt === undefined ? false : parsedDate(events.startsAt) >= now);
  let eventsThisMonth;
  if(search != "")
  {
    eventsThisMonth = upcomingevents.filter(event => parsedDate(event.startsAt).getMonth() === monthNumber && event.title.toLowerCase().includes(search.toLowerCase()));
  }
  else
  {
    eventsThisMonth = upcomingevents.filter(event => parsedDate(event.startsAt).getMonth() === monthNumber);
  }
    const eventsPerPage = eventsThisMonth.slice((page - 1) * itemPerPage, page * itemPerPage);
  const monthNames: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  if(page == 1)
  {
    EventCounter.count = 0;
  }
  else
  {
    EventCounter.count = itemPerPage * (page - 1);
  }  
  // than the function returns JSX
  // the JSX always needs some opening tags and in there 
  // you can have more opening tags
  return (
    <div>
      <header>
        <h1 className="table-title">Upcoming Events</h1>
      </header>
      <div className="main-filter">
        <input className="search-filter" placeholder="search" value={search} onChange={e => setSearch(e.target.value)}/>
      </div>
      <div className="table-wrapper">
        <div className="Calendar">
          <button className="left-Button" onClick={() => setMonthNumber(prev => prev === 0 ? 11 : prev - 1)}>&lt;</button>
          <p className="monthName">{monthNames[monthNumber]}</p>
          <p className="underLine">______________________________</p>
          <button className="right-Button" onClick={() => setMonthNumber(prev => prev === 11 ? 0 : prev + 1)}>&gt;</button>
        </div>
        <div className="events-container">
          {/* mapping over all elements that have been filtered and taking only their id and title */}
          {eventsThisMonth.length === 0 ? (
            <p className="errorMessage">No events this month</p>
          ) : (
            eventsPerPage.map(event => {
            const eventCount = new EventCounter(); 
            if(eventsThisMonth)
            {
              return (
              <div className="event">
                <EventCardRender
                key={event.id}
                id={event.id}
                title={event.title}
                CreatedBy={event.createdBy}
                users={userList}
                eventId={eventCount.id}
                />
              </div>
              );
            }
          })
          )};
          {eventsThisMonth.length != 0 && (
          <div className="pages">
            <button className="bottom-left-Button" onClick={() => setPage(prev => prev <= 1 ? prev : prev - 1)}>&lt;</button>
            <p className="PageNumber">{page}</p>
            <button className="bottom-right-Button" onClick={() => setPage(prev => prev + 1)}>&gt;</button>
          </div>
          )};
        </div>
      </div>
    </div>
  );
};

// exports the NotFound component so we can use it in another file
export default Events;
