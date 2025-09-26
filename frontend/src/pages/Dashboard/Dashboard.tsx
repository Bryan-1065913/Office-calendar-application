// src/Dashboard/Dashboard.tsx
import LayoutDashboard from '../../components/common/Layout/Layout-Dashboard';
import Overview from "../../components/common/Dashboard/Overview";

function Dashboard() {
    return (
        <LayoutDashboard>
            <Overview />
        </LayoutDashboard>
    );
}

export default Dashboard;