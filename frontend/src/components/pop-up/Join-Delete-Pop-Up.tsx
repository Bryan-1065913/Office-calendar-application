import type { ReactNode } from "react";
import '../../styles/PopUp/PopUp.css'

interface propsPopUp
{
    children: ReactNode;
}

const Popup = ({ children }: propsPopUp) => {

    return (
        <div className="popup-overlay">
            {children}
        </div>
    );
};

export default Popup;