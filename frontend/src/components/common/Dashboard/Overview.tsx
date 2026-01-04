// src/components/common/Dashboard/Overview.tsx
import "/src/styles/Dashboard/overview.css";
// import {currentUser} from "../../../authentication/auth";
import GreetingMessage from "./GreetingMessage";
import CalendarModal from "../Calendar/CalendarModal.tsx";
import TeamOverviewCard from "./TeamOverviewCard.tsx";
import WeekOverviewCard from "./WeekOverviewCard";
import ScheduleOverviewCard from "./ScheduleOverviewCard.tsx";
import TasksOverviewCard from "./TasksOverviewCard.tsx";
import ProfileOverviewCard from "./ProfileOverviewCard.tsx";

//*
import { useEffect, useState} from "react";
import { useFetchSecond } from '../../../hooks/useFetchSecondGet';
import {useAuth} from "../../../authentication/AuthContext";
import NotFound from "../NotFound/NotFound.tsx";

interface EventParticipation {
    id: number;
    userId: number;
    eventId: number;
    status: string;
    createdAt: string;
}
//*


const Overview = () => {
    //*
    const { user } = useAuth();
    const [eventParticipations, setEventParticipations] = useState<EventParticipation[]>([]);
    const { data2, isLoading2, error2 } = useFetchSecond<EventParticipation[]>({ url: `http://localhost:5017/api/EventParticipations` });
    useEffect(() => {
        if (data2) {
            setEventParticipations(data2);
        }
    }, [data2]);

    if (isLoading2) return <p>Loading...</p>;
    if (error2) return <p>Error: {error2}</p>;
    if(user == null || user == undefined)
    {
        return <NotFound/>
    }
    const eventUserParticipations = eventParticipations.filter(e => e.userId == user.userId).length
    //*

    return (
        <div>
            <GreetingMessage meetings={3} events={eventUserParticipations} tasks={5} />

            <div className="container m-0 p-0">
                <div className="row g-3">
                    <div className="col-md-7">
                        <div className="d-flex flex-column gap-3">
                            <WeekOverviewCard />
                            <TeamOverviewCard />
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div className="row g-3">
                            <div className="col-12"><ScheduleOverviewCard /></div>
                            <div className="col-12"><TasksOverviewCard /></div>
                            <div className="col-12"><ProfileOverviewCard /></div>
                        </div>
                    </div>
                </div>
            </div>

            <CalendarModal />
        </div>
    );
};

export default Overview;