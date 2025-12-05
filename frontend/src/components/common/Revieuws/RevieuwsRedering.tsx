import "../../../styles/Revieuws/Revieuws.scss";
import { useAuth } from "../../../authentication/AuthContext";

interface revieuwProps {
    text: string;
}

const RevieuwsRender = ({text}: revieuwProps) => {
    const {user} = useAuth();
    
    return(
        <>
            <div className="Revieuw">
                <p className="Revieuws-text">{text}</p>
            </div>
        </>
    );
}
export default RevieuwsRender;