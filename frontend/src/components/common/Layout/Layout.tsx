// src/components/common/Layout/LayoutDashboard.tsx
import { NavLink, Outlet } from "react-router";
import { Nav } from "react-bootstrap";
import "/src/styles/General/style.css";
import "/src/styles/Layout/layout-dashboard.css";
import Header from "../Header/Header.tsx";

const Layout = () => {

    return (
        <div className={`dashboard-layout`}>
            {/* Topbar */}
            <Header />

            {/* Sidebar + Content */}
            <div className="dashboard-body">
                <aside className="dashboard-sidebar">
                    <Nav className="flex-column">
                        <Nav.Link as={NavLink} to="/dashboard" end>Overview</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/events">Events</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/agenda">Calendar</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/tasks">Tasks</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/team">Team</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/profile">Profile</Nav.Link>
                    </Nav>
                </aside>

                <main className="dashboard-content"><Outlet /></main>
            </div>
        </div>
    );
};

export default Layout;