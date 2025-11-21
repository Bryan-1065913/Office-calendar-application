// src/components/common/Layout/LayoutDashboard.tsx
import { NavLink, Outlet } from "react-router";
import { Nav } from "react-bootstrap";
import "/src/styles/General/style.css";
import "/src/styles/Layout/Layout.css";
import Header from "../Header/Header";

const LayoutDashboard = () => {
    return (
        <div className="dashboard-layout">
            <Header />

            <div className="dashboard-body">
                <aside className="dashboard-sidebar">
                    <h2 className="sidebar-title">Dashboard</h2>

                    <Nav className="flex-column sidebar-nav">
                        <Nav.Link as={NavLink} to="/dashboard" end>Overview</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/events">Events</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/agenda">Calendar</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/tasks">Tasks</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/team">Team</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/profile">Profile</Nav.Link>
                    </Nav>
                </aside>

                <main className="dashboard-content">
                    <div className="content-card">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LayoutDashboard;