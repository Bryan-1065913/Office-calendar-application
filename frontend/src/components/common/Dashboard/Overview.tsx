// src/components/common/Dashboard/Overview.tsx
import "/src/styles/Dashboard/overview.css";
// import {currentUser} from "../../../authentication/auth";
import GreetingMessage from "./GreetingMessage";
import ActivityModal from "./ActivityModal";
import TeamOverviewCard from "./TeamOverviewCard.tsx";
import WeekOverviewCard from "./WeekOverviewCard";
import ScheduleOverviewCard from "./ScheduleOverviewCard.tsx";
import TasksOverviewCard from "./TasksOverviewCard.tsx";
import ProfileOverviewCard from "./ProfileOverviewCard.tsx";

const Overview = () => {

    return (
        <div>
            <GreetingMessage meetings={3} events={2} tasks={5} />

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

            <ActivityModal />
        </div>
    );
};

export default Overview;