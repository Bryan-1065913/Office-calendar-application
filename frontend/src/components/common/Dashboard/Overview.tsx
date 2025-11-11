// src/components/common/Dashboard/Overview.tsx
import "/src/styles/Dashboard/overview.css";
// import {currentUser} from "../../../authentication/auth";
import { useAuth } from "../../../authentication/AuthContext";
import ActivityModal from "./ActivityModal";
import TeamCard from "./TeamCard";
import WeekOverviewCard from "./WeekOverviewCard";
import TodayCard from "./TodayCard";
import TasksCard from "./TasksCard";
import NotesCard from "./NotesCard";
import ProfileCard from "./Profile/ProfileCard";

const Overview = () => {
    const { user } = useAuth();

    return (
        <div>
            <div>
                <h1>Welcome, <span className="NameGreeting">{user?.firstName}</span>!</h1>
                <p>Today: [hoeveelheid] meetings, [hoeveelheid] events, [hoeveelheid] tasks</p>
            </div>

            <div className="container m-0 p-0">
                <div className="row g-3">
                    <div className="col-md-7">
                        <div className="d-flex flex-column gap-3">
                            <WeekOverviewCard />
                            <TeamCard />
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div className="row g-3">
                            <div className="col-12"><TodayCard /></div>
                            <div className="col-12"><TasksCard /></div>
                            <div className="col-12"><NotesCard /></div>
                            <div className="col-12"><ProfileCard /></div>
                        </div>
                    </div>
                </div>
            </div>

            <ActivityModal />
        </div>
    );
};

export default Overview;