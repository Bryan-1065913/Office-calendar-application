// src/App.tsx
import '..\..\styles\NotFoundNotFound.scss';
// useEffect hook from react component
import { useEffect } from 'react';
// 404 NotFound component
function NotFound() {
    // this use effect happens everytime the component renders
    // this has its own space of stuff happening such as fetch
    useEffect(() => {
        //scrolls to a certain place of the webpage
        window.scrollTo(300, 300);
    }); // because of no []dependency array it renders everytime the component renders 
    // for example with f5
    // return jsx for the 404 not found message
    return (
         <p className="NotFound">404 Not Found.</p>
    );
}
// exports the NotFound component so we can use it in another file
export default NotFound;