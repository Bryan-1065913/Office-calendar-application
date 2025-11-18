import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import App from './App';
import Home from './pages/Home/Home';
import Events from './pages/Events/Events';
import EventDetails from './pages/Events/EventDetail';
import EventForm from './pages/Forms/EventForms';
import ProtectedRoute from './authentication/ProtectedRoute';
import LoginPage from './components/common/login-register/Login';
import RegisterPage from './components/common/login-register/Register';
import { AuthProvider } from './authentication/AuthContext';
import LayoutDashboard from './components/common/Layout/Layout-Dashboard';
import Overview from './components/common/Dashboard/Overview';
import ProfileCard from './components/common/Dashboard/Profile/ProfileCard';


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

            { path: 'events', element: <Events /> },
            { path: 'events/:id', element: <EventDetails /> },
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