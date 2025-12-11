import "../../../styles/Reviews/Reviews.css";
import { useState } from "react";
import {useAuth} from "../../../authentication/AuthContext";
import NotFound from "../NotFound/NotFound";
import RevieuwsRender from "./ReviewsRedering";
import '../../../assets/fonts/sen.css';
import Button from "../UI/Buttons";
import { useNavigate } from "react-router";
import { useFetch } from "../../../hooks/useFetchGet";

interface Review {
    user_id: number;
    event_id: number;
    date: string;
    title: string;
    text: string;
    created_at: string;
    updated_at?: string;
}

interface propsReview {
    id: number;
}

const API_BASE_URL = import.meta.env.VITE_API_API || "http://localhost:5017/api";

const Revieuws = (props: propsReview) => {
    const {user} = useAuth();
    const [input, setInput] = useState("");
    const [titleReview, setTitle] = useState("");
    const [textLength, setTextLength] = useState(0);
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
        const titleInputValue = titleInput(input);
        setTitle(titleInputValue);
        const response = await fetch("http://localhost:5017/api/Review", {
            method: 'POST',
            headers : {
                    'content-type' : 'application/json',
            },
            body: JSON.stringify({
                userId: user.userId,
                eventId:  props.id,
                date: new Date().toISOString(),
                Title: titleInputValue,     // Make sure to use your local transformed variable
                TextReview: input           // Correct property name
            }),
        });
        if (response.ok) {
            console.log("Successfully made Review");
        }
        setTextLength(0);
        setTitle("");
        setInput("");
    }   
    const { data: review } = useFetch<Review[]>({ url: `${API_BASE_URL}/Review/reviewPerEvent/${props.id}` });

    return(
        <>
            <div className="Main-wrapper">
                <Button className="Main-Button" variant="primary" onClick={() => navigate(`/events/`)}>&nbsp;&nbsp;&nbsp;&nbsp;Terug&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
                <form className="formulier-Revieuw">  
                    <textarea
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setTextLength(e.target.value.length); }}
                        placeholder="Type here your revieuw"
                        className="revieuw-textarea"
                    />
                    {textLength > 500 || textLength < 150 ? (
                        <div className="Warning-Message">Warning you either cant have less than 150 or more than 500 characters</div>
                    ) : null}
                    <div className="text-length">{textLength} / 500</div>
                    <button className="submit-button" onClick={saveText}><img src="/src/assets/icons/verzend.png" alt="Logo" width="50" height="50"/></button>
                </form>
            </div>
            {review && review.length > 0 && ( 
            <div className="Main-Revieuw-Render-Wrapper">
            {review.map(
                (revieuw) => <RevieuwsRender 
                    user_id={revieuw.user_id}
                    event_id={revieuw.event_id}
                    date={revieuw.date}
                    title={revieuw.title}
                    text={revieuw.text}
                    created_at={revieuw.created_at}
                    updated_at={revieuw.updated_at}
                />
            )}
            </div>
            )}
        </>
    );
}
export default Revieuws;