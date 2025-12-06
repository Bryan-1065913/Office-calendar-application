import "../../../styles/Reviews/Reviews.css";
import { useAuth } from "../../../authentication/AuthContext";
import '../../../assets/fonts/sen.css';

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