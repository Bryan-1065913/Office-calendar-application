import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../authentication/AuthContext";
import "../../../styles/General/Header.css";
import Logo from "../../../assets/images/logo.png";
import UserIcon from "../../../assets/icons/default-user.svg?react";
import Chevron from "../../../assets/icons/chevron.svg?react";
import { Link } from "react-router";

const Header = () => {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="header">
            <div className="header-left">
                <img src={Logo} alt="Office Calendar" className="header-logo" />
            </div>

            <div className="header-right">
                {user ? (
                    <div ref={dropdownRef} className="profile-area" onClick={() => setOpen(o => !o)}>
                        <UserIcon className="profile-icon" />
                        <Chevron className={`chevron-profile ${open ? "rotated" : ""}`} />

                        {open && (
                            <div className="profile-dropdown open">
                                <button onClick={logout}>Sign out</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/login" className="btn-login">Login</Link>
                        <Link to="/register" className="btn-register">Register</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;