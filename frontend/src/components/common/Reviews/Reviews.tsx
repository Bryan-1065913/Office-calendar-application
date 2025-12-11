import "../../../styles/Reviews/Reviews.css";
import { useState } from "react";
import {useAuth} from "../../../authentication/AuthContext";
import NotFound from "../NotFound/NotFound";
import RevieuwsRender from "./ReviewsRedering";
import '../../../assets/fonts/sen.css';
import Button from "../UI/Buttons";
import { Navigate, useNavigate } from "react-router";

const Revieuws = () => {
    const {user} = useAuth();
    const [input, setInput] = useState("");
    const [title, setTitle] = useState("");
    const [textLength, setTextLength] = useState(0);
    const [saveTextList, setSaveTextList] = useState<string[]>([]);
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

    const saveText = (e: React.MouseEvent) => {
        if(textLength > 500 || textLength < 150) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        const titleInputValue = titleInput(input);
        setTitle(titleInputValue);
        setSaveTextList(prev => [...prev, input]);
        setTextLength(0);
        setTitle("");
        setInput("");
    }   

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

            <div className="Main-Revieuw-Render-Wrapper">
                {saveTextList.map((element, index) => (
                    <RevieuwsRender key={index} text={element} />
                ))}
            </div>
        </>
    );
}
export default Revieuws;