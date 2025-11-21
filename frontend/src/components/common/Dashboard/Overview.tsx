// src/components/common/Dashboard/Overview.tsx
import "/src/styles/Dashboard/overview.css";
// import {currentUser} from "../../../authentication/auth";
import GreetingMessage from "./GreetingMessage";
import ActivityModal from "./ActivityModal";
import TeamOverviewCard from "./TeamOverviewCard.tsx";
import WeekOverviewCard from "./WeekOverviewCard";
import ScheduleCard from "./ScheduleCard.tsx";
import TasksCard from "./TasksCard";
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
                            <div className="col-12"><ScheduleCard /></div>
                            <div className="col-12"><TasksCard /></div>
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