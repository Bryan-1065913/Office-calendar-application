import "../../../styles/Reviews/Reviews.css";
import { useState } from "react";
import {useAuth} from "../../../authentication/AuthContext";
import NotFound from "../NotFound/NotFound";
import RevieuwsRender from "./ReviewsRedering";
import '../../../assets/fonts/sen.css';

const Revieuws = () => {
    const {user} = useAuth();
    const [input, setInput] = useState("");
    const [saveTextList, setSaveTextList] = useState<string[]>([]);
    if(user == null)
    {
        return <NotFound/>
    }
    if (user.role != "user" && user.role != "admin") 
    {
        return <NotFound/>
    }
    const saveText = (e: React.MouseEvent) => {
        e.preventDefault();
        setSaveTextList(prev => [...prev, input]);
        setInput("");
    }   

    return(
        <>
            <div className="Main-wrapper">
                <form className="formulier-Revieuw">  
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type here your revieuw"
                        className="revieuw-textarea"
                    />
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