// src/components/common/Dashboard/GreetingMessage.tsx
import "../../../styles/Dashboard/GreetingMessage.css";
import { useAuth } from "../../../authentication/AuthContext";

type GreetingMessageProps = {
    meetings: number;
    events: number;
    tasks: number;
};

const GreetingMessage = ({ meetings, events, tasks }: GreetingMessageProps) => {
    const { user } = useAuth();

    return (
        <div className="greeting-wrapper">
            <h1 className="greeting-title">
                Welcome, <span className="greeting-name">{user?.firstName}</span>!
            </h1>

            <p className="greeting-subtext">
                Today: {meetings} meetings, {events} events, {tasks} tasks
            </p>
        </div>
    );
};

export default GreetingMessage;