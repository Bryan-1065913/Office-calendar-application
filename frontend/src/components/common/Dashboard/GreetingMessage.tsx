// src/components/common/Dashboard/GreetingMessage.tsx
import "../../../styles/Dashboard/GreetingMessage.css";
import { useAuth } from "../../../authentication/AuthContext";

const GreetingMessage = () => {
    const { user } = useAuth();

    return (
        <div className="greeting-wrapper">
            <h1 className="greeting-title">
                Welcome, <span className="greeting-name">{user?.firstName}</span>!
            </h1>
        </div>
    );
};

export default GreetingMessage;