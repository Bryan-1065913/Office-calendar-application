import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import App from './App';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Events from './pages/Events/Events';
import EventDetails from './pages/Events/EventDetail';
import EventForm from './pages/Forms/EventForms';
import ProtectedRoute from './authentication/ProtectedRoute';
import WarningDeleteForm from './pages/Forms/Warning_Delete_Event'
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },

            {
                element: <ProtectedRoute role="Admin" />,
                children: [
                    { path: 'dashboard', element: <Dashboard /> },
                    { path: 'eventform', element: <EventForm /> },
                ],
            },

            { path: 'events', element: <Events /> },
            { path: 'events/:id', element: <EventDetails /> },        
            { path: '/eventform', element: <EventForm /> },
            { path: '/WarningDeleteEvent', element: <WarningDeleteForm/> },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);