// src/App.tsx
import './NotFound.scss';
import { useEffect } from 'react';
function NotFound() {
    useEffect(() => {
        window.scrollTo(300, 300);
    });
    return (
         <p className="NotFound">404 Not Found.</p>
    );
}

export default NotFound;