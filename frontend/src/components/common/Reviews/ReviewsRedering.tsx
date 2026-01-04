import "../../../styles/Reviews/Reviews.css";
import { useAuth } from "../../../authentication/AuthContext";
import '../../../assets/fonts/sen.css';
import calendarIcon from "../../../assets/icons/calendar.svg";
import userIcon from "../../../assets/icons/user.svg";
import Button from "../UI/Buttons";

interface PropsReview {
    id: number;
    userId: number;
    event_id: number;
    firstName: string;
    lastName: string;
    text: string;
    created_at: string;
    updated_at?: string;
}

const ReviewsRender = ({
                            id,
                            firstName,
                            lastName,
                            userId,
                            text,
                            created_at,
    }: PropsReview) => {
    const {user} = useAuth();
    const MONTHS = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const dateTime = created_at.split("T");
    const date = dateTime[0].split("-");
    const time = dateTime[1].split(":");
    const Delete = async () => {
        if(user?.userId == userId)
        {
            const response = await fetch(`http://localhost:5017/api/Review/${id}`, {
                method: 'DELETE',
                headers : {
                    'content-type' : 'application/json',
                },
            });
            if (response.ok) {
                console.log("Successfully deleted Review");
            }
        }
    }
    return(
        <>
            <div className="Review">
                <p className="Review-text">{text}</p>
                <p className="other-content-review">
                    <img src={userIcon} alt="User Icon" height="20" width="20"/>
                    {firstName}&nbsp;
                    {lastName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <img src={calendarIcon} alt="Calendar Icon" height="20" width="20"/> 
                    {date[2]}&nbsp; 
                    {MONTHS[Number(date[1]) - 1]}&nbsp; 
                    {date[0]},&nbsp; 
                    {time[0]}:
                    {time[1]}:
                    {time[2].split(".")[0]}&nbsp;
                </p>
                {user?.userId == userId && (
                    <Button className="Delete-Button" variant="primary" onClick={Delete}>&nbsp;&nbsp;&nbsp;&nbsp;Delete&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
                )}
            </div>
        </>
    );
}
export default ReviewsRender;