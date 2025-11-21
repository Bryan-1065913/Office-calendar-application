// src/components/common/Layout/LayoutDashboard.tsx
import { NavLink, Outlet } from "react-router";
import { Nav } from "react-bootstrap";
import "/src/styles/General/style.css";
import "/src/styles/Layout/Layout.css";
import Header from "../Header/Header";
import House from "../../../assets/icons/house.svg?react";
import StarCalendar from "../../../assets/icons/calendar-star.svg?react";
import Calendar from "../../../assets/icons/calendar.svg?react";
import TasksList from "../../../assets/icons/list.svg?react";
import Users from "../../../assets/icons/users.svg?react";
import User from "../../../assets/icons/user.svg?react";

const LayoutDashboard = () => {
    return (
        <div className="dashboard-layout">
            <Header />

            <div className="dashboard-body">
                <aside className="dashboard-sidebar">
                    <h2 className="sidebar-title">Dashboard</h2>

                    <Nav className="flex-column sidebar-nav">
                        <Nav.Link as={NavLink} to="/dashboard" end><House className="nav-icon house" /> Overview</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/events"><StarCalendar className="nav-icon star-calendar" /> Events</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/agenda"><Calendar className="nav-icon calendar" /> Calendar</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/tasks"><TasksList className="nav-icon tasks-list" /> Tasks</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/team"><Users className="nav-icon users" /> Team</Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard/profile"><User className="nav-icon user" />Profile</Nav.Link>
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