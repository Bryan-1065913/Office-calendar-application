// src/components/common/Layout/Layout.tsx
import { NavLink, Outlet } from "react-router";
import { Nav } from "react-bootstrap";
import { useState } from "react";
import { useAuth } from "../../../authentication/AuthContext";
import { workStatusService } from "../../../services/workStatusService";
import CalendarModal from "../Calendar/CalendarModal";
import "/src/styles/General/style.css";
import "/src/styles/Layout/Layout.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import House from "../../../assets/icons/house.svg?react";
import StarCalendar from "../../../assets/icons/calendar-star.svg?react";
import Calendar from "../../../assets/icons/calendar.svg?react";
import TasksList from "../../../assets/icons/list.svg?react";
import Users from "../../../assets/icons/users.svg?react";
import User from "../../../assets/icons/user.svg?react";

type PlanningWithIds = {
    [key: string]: {
        status: string;
        id?: number;
    };
};

const Layout = () => {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function mapLabelToStatus(label: string): string {
        const map: Record<string, string> = {
            "office": "office",
            "home": "home",
            "day off": "vacation",
            "sick": "sick",
            "holiday": "vacation",
            "other": "other"
        };
        return map[label] || label;
    }

    function formatDate(date: Date) {
        return date.toLocaleDateString("sv-SE");
    }

    const handleSavePlanning = async (planning: PlanningWithIds) => {
        if (!user?.userId) {
            setError("Gebruiker niet ingelogd.");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            // Filter alleen dagen met een gekozen activiteit
            const planningEntries = Object.entries(planning).filter(
                ([_, data]) => data.status !== ''
            );

            const savePromises = planningEntries.map(([dateKey, data]) => {
                const date = new Date(dateKey);
                const dateStr = formatDate(date);
                const mappedStatus = mapLabelToStatus(data.status);

                const requestData = {
                    userId: user.userId,
                    date: dateStr,
                    status: mappedStatus
                };

                // Als er een ID is, update. Anders create.
                if (data.id) {
                    console.log(`🔄 Updating status ${data.id} for ${dateStr}`);
                    return workStatusService.updateWorkStatus(data.id, requestData);
                } else {
                    console.log(`➕ Creating new status for ${dateStr}`);
                    return workStatusService.createWorkStatus(requestData);
                }
            });

            await Promise.all(savePromises);
            console.log("✅ Planning succesvol opgeslagen");

            // Trigger refresh event voor alle Calendar instances
            window.dispatchEvent(new CustomEvent('calendarRefresh'));

        } catch (err: any) {
            console.error("❌ Fout bij opslaan planning:", err);
            setError("Kon planning niet opslaan. Probeer het opnieuw.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="layout">
            <Header />

            <div className="dashboard-body">
                <aside className="dashboard-sidebar">
                    <h2 className="sidebar-title">Dashboard</h2>

                    <Nav className="flex-column sidebar-nav">
                        <Nav.Link as={NavLink} to="/" end><House className="nav-icon house" /> Overview</Nav.Link>
                        <Nav.Link as={NavLink} to="/events"><StarCalendar className="nav-icon star-calendar" /> Events</Nav.Link>
                        <Nav.Link as={NavLink} to="/agenda"><Calendar className="nav-icon calendar" /> Calendar</Nav.Link>
                        <Nav.Link as={NavLink} to="/tasks"><TasksList className="nav-icon tasks-list" /> Tasks</Nav.Link>
                        <Nav.Link as={NavLink} to="/team"><Users className="nav-icon users" /> Team</Nav.Link>
                        <Nav.Link as={NavLink} to="/profile"><User className="nav-icon user" />Profile</Nav.Link>
                        {/* Admin link  */}
                        {user?.role === 'admin' && (
                        <Nav.Link as={NavLink} to="/admin"><User className="nav-icon users" />Admin</Nav.Link>
                        )}
                    </Nav>
                </aside>

                <main className="dashboard-content">
                    {error && <div className="alert alert-danger m-3">{error}</div>}
                    {saving && <div className="alert alert-info m-3">Planning wordt opgeslagen...</div>}

                    <div className="content-card">
                        <Outlet />
                    </div>
                </main>
            </div>

            <Footer />

            {/* Modal - staat buiten de main content voor correcte z-index */}
            <CalendarModal onSave={handleSavePlanning} />
        </div>
    );
};

export default Layout;