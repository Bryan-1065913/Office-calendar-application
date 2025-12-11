import "../../../styles/Reviews/Reviews.css";
import { useAuth } from "../../../authentication/AuthContext";
import '../../../assets/fonts/sen.css';

interface PropsReview {
    user_id: number;
    event_id: number;
    date: string;
    title: string;
    text: string;
    created_at: string;
    updated_at?: string;
}

const RevieuwsRender = ({user_id,
                            event_id,
                            date,
                            title,
                            text,
                            created_at,
                            updated_at 
    }: PropsReview) => {
    const {user} = useAuth();
    
    return(
        <>
            <div className="Revieuw">
                <p>{title}</p>
                <p>{date}</p>
                <p>{created_at}</p>
                <p>{updated_at}</p>
                <p className="Revieuws-text">{text}</p>
            </div>
        </>
    );
}
export default RevieuwsRender;