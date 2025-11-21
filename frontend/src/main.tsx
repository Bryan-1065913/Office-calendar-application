import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import './assets/fonts/sen.css';

import App from './App';
import Home from './pages/Home/Home';
import Events from './pages/Events/Events';
import EventDetails from './components/event/EventDetail.tsx';
import EventForm from './pages/Forms/EventForms';
import ProtectedRoute from './authentication/ProtectedRoute';
import LoginPage from './components/common/login-register/Login';
import RegisterPage from './components/common/login-register/Register';
import { AuthProvider } from './authentication/AuthContext';
import LayoutDashboard from './components/common/Layout/Layout.tsx';
import Overview from './components/common/Dashboard/Overview';
import ProfileCard from './components/common/Dashboard/ProfileOverviewCard.tsx';
import EventOverzicht from './components/common/Overzicht/EventsComponent.tsx'
// import ChangeProfile from './components/common/Dashboard/Profile/ChangeProfile';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },

            {
                element: <ProtectedRoute /*role="Admin"*/ />,
                children: [
                    { 
                        path: 'dashboard',  
                        element: <LayoutDashboard />, 
                        children: 
                        [
                            { index: true , element: <Overview /> },

                            { path: 'profile', element: <ProfileCard />},
                            { path: 'events', element: <EventOverzicht/>},
                            { path: '/dashboard/events/:id', element: <EventDetails /> },
                            // { path: 'changeProfile', element: <ChangeProfile />},



                            // dit worden de nieuwe children die moet je aanmaken
                            // { path: 'profile', element: <Agenda />},
                            // { path: 'profile', element: <Taks />},
                            // { path: 'profile', element: <Team />},
                            // { path: 'profile', element: <Settings />},
                            
                        ],
                    },
                    { path: 'eventform', element: <EventForm /> },
                    
                ],
            },
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> }
        ],
    },

]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);