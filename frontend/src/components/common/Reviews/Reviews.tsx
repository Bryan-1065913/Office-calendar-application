import "../../../styles/Reviews/Reviews.css";
import { useState } from "react";
import {useAuth} from "../../../authentication/AuthContext";
import NotFound from "../NotFound/NotFound";
import ReviewsRender from "./ReviewsRedering";
import '../../../assets/fonts/sen.css';
import Button from "../UI/Buttons";
import { useNavigate } from "react-router";
import { useFetch } from "../../../hooks/useFetchGet";
import { useFetchSecond } from "../../../hooks/useFetchSecondGet";

interface Review {
    id: number;
    userId: number;
    eventId: number;
    textReview: string;
    createdAt: string;
    updatedAt?: string;
}

interface propsReview {
    id: number;
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
}

const API_BASE_URL = import.meta.env.VITE_API_API || "http://localhost:5017/api";

const Reviews = (props: propsReview) => {
    const {user} = useAuth();
    const [input, setInput] = useState("");
    const [textLength, setTextLength] = useState(0);
    const { data2: users } = useFetchSecond<User[]>({ url: `${API_BASE_URL}/users` });
    const navigate = useNavigate();
    if(user == null)
    {
        return <NotFound/>
    }
    if (user.role != "user" && user.role != "admin") 
    {
        return <NotFound/>
    }

    const titleInput = (input: string) => {
        // Hier kun je extra logica toevoegen als dat nodig is
        input.split(".")[0];
        if(input.length > 10) 
        {
            return input.charAt(0).toUpperCase() + input.slice(1);
        }
        return input;
    }

    const saveText = async (e: React.MouseEvent) => {
        if(textLength > 500 || textLength < 150) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        const response = await fetch("http://localhost:5017/api/Review", {
            method: 'POST',
            headers : {
                    'content-type' : 'application/json',
            },
            body: JSON.stringify({
                userId: user.userId,
                eventId:  props.id,
                createdAt: new Date().toISOString(),
                TextReview: input           // Correct property name
            }),
        });
        if (response.ok) {
            console.log("Successfully made Review");
        }
        setTextLength(0);
        setInput("");
    }   
    const { data: review } = useFetch<Review[]>({ url: `${API_BASE_URL}/Review/reviewPerEvent/${props.id}` });
    return(
        <>
            <div className="Main-wrapper">
                <Button className="Main-Button" variant="primary" onClick={() => navigate(`/events/`)}>&nbsp;&nbsp;&nbsp;&nbsp;Terug&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
                <form className="formulier-Review">  
                    <textarea
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setTextLength(e.target.value.length); }}
                        placeholder="Type here your review"
                        className="review-textarea"
                    />
                    {textLength > 500 || textLength < 150 ? (
                        <div className="Warning-Message">Warning you either cant have less than 150 or more than 500 characters</div>
                    ) : null}
                    <div className="text-length">{textLength} / 500</div>
                    <button className="submit-button" onClick={saveText}><img src="/src/assets/icons/verzend.png" alt="Logo" width="50" height="50"/></button>
                </form>
            </div>
            {review && review.length > 0 && ( 
            <div className="Main-Review-Render-Wrapper">
            {review.map(
                (review) => <ReviewsRender 
                    key={review.id}
                    id={review.id}
                    firstName={users?.find(u => u.id === review.userId)?.firstName || "Unknown"}
                    lastName={users?.find(u => u.id === review.userId)?.lastName || "Unknown"}
                    userId={review.userId}
                    event_id={review.eventId}
                    text={review.textReview}
                    created_at={review.createdAt}
                    updated_at={review.updatedAt}
                />
            )}
            </div>
            )}
        </>
    );
}
export default Reviews;