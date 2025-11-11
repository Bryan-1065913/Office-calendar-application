// src/components/common/Layout/LayoutDashboard.tsx
import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { Nav } from "react-bootstrap";
import "/src/styles/General/style.css";
import "/src/styles/Layout/layout-dashboard.css";
import HeaderDashboard from "../Header/Header-Dashboard";

const LayoutDashboard = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`dashboard-layout ${open ? "sidebar-open" : ""}`}>
            {/* Topbar */}
            <HeaderDashboard open={open} onToggle={() => setOpen(v => !v)} />

            {/* Sidebar + Content */}
            <div className="dashboard-body">
                <aside className="dashboard-sidebar">
                    <Nav className="flex-column">
                        <Nav.Link as={NavLink} to="/dashboard" end>Dashboard</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/profile">Profile</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/agenda">Mijn agenda</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/tasks">Taken</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/team">Team</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/settings">Instellingen</Nav.Link>
                    </Nav>
                </aside>

                <main className="dashboard-content"><Outlet /></main>
            </div>
        </div>
    );
};

export default LayoutDashboard;