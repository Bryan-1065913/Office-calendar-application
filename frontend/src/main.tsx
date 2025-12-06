import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import './assets/fonts/sen.css';

// import EventDetails from './components/event/EventDetail.tsx';
import EventForm from './pages/Forms/EventForms';
import ProtectedRoute from './authentication/ProtectedRoute';
import LoginPage from './components/common/login-register/Login';
import RegisterPage from './components/common/login-register/Register';
import { AuthProvider } from './authentication/AuthContext';
import Layout from './components/common/Layout/Layout.tsx';
import Overview from './components/common/Dashboard/Overview';
import Profile from './components/common/Profile/Profile.tsx';
import Calendar from './components/common/Calendar/Calendar.tsx';
import EventOverzicht from './components/common/Event/Events.tsx';
import EventDetails from './components/common/Event/EventDetail.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <Layout />,
                children: [
                    { index: true, element: <Overview /> },
                    { path: 'events', element: <EventOverzicht /> },
                    { path: 'events/:id', element: <EventDetails /> },
                    { path: 'agenda', element: <Calendar /> },
                    { path: 'tasks', element: <div>Tasks - Coming soon</div> },   // ← Voeg deze toe
                    { path: 'team', element: <div>Team - Coming soon</div> },     // ← Voeg deze toe
                    { path: 'profile', element: <Profile /> },
                    { path: 'eventform', element: <EventForm /> },
                ],
            },
        ],
    },
    { path: 'login', element: <LoginPage /> },
    { path: 'register', element: <RegisterPage /> },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);