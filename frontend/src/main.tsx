import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import './assets/fonts/sen.css';

import EventDetails from './components/event/EventDetail.tsx';
import EventForm from './pages/Forms/EventForms';
import ProtectedRoute from './authentication/ProtectedRoute';
import LoginPage from './components/common/login-register/Login';
import RegisterPage from './components/common/login-register/Register';
import { AuthProvider } from './authentication/AuthContext';
import LayoutDashboard from './components/common/Layout/Layout.tsx';
import Overview from './components/common/Dashboard/Overview';
import ProfileCard from './components/common/Dashboard/ProfileOverviewCard.tsx';
import EventOverzicht from './components/common/Overzicht/EventsComponent.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <LayoutDashboard />,
                children: [
                    { index: true, element: <Overview /> },
                    { path: 'events', element: <EventOverzicht /> },
                    { path: 'events/:id', element: <EventDetails /> },
                    { path: 'profile', element: <ProfileCard /> },
                    { path: 'eventform', element: <EventForm /> },

                    // Voeg deze toe wanneer je ze implementeert:
                    // { path: 'agenda', element: <AgendaPage /> },
                    // { path: 'tasks', element: <TasksPage /> },
                    // { path: 'team', element: <TeamPage /> },
                ],
            },
        ],
    },
    // Login/Register buiten de protected route
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