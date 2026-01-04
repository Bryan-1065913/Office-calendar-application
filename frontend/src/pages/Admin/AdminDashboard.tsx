// src/pages/Admin/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../authentication/AuthContext';
import { adminService } from '../../services/adminService';
import type { User } from '../../services/adminService';
import { useNavigate } from 'react-router';
import AdminUserList from '../../components/common/Admin/AdminUsersList';
import AdminEventsList from '../../components/common/Admin/AdminEventList';
import Button from '../../components/common/UI/Buttons';
import '../../styles/Admin/AdminDashboard.css';

const AdminDashboard = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [eventSearchTerm, setEventSearchTerm] = useState('');

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }

        loadData();
    }, [user, navigate]);

    const loadData = async () => {
        if (!token) return;
        setLoading(true);

        try {
            const usersData = await adminService.getAllUsers(token);
            setUsers(usersData);

            const eventsData = await adminService.getAllEvents(token);
            setEvents(eventsData);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (id: number) => {
        if (!token) return;

        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }

        try {
            await adminService.deleteEvent(token, id);
            await loadData();
        } catch (err: any) {
            setError(err.message);
        }
    }

    const handleDelete = async (id: number) => {
        if (!token) return;

        if (id === user?.id) {
            alert('You can not delete yourself')
            return;
        }

        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            await adminService.deleteUser(token, id);
            await loadData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const filteredUsers = users.filter(u =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredEvents = events.filter(e =>
        e.title?.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
        e.description?.toLowerCase().includes(eventSearchTerm.toLowerCase())
    );

    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const userCount = users.filter(u => u.role === 'user').length;

    if (loading) return <div>...Loading</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="admin-dashboard">
            <div className="stats-row">
                <div className="stat-card">
                    <p className="stat-label">Total Users</p>
                    <h2 className="stat-number">{totalUsers}</h2>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Admins</p>
                    <h2 className="stat-number">{adminCount}</h2>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Regular Users</p>
                    <h2 className="stat-number">{userCount}</h2>
                </div>
            </div>

            <div className="content-grid">
                <div className="users-card">
                    <div className="card-header">
                        <h2>All Users</h2>
                        <div className="header-actions">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button
                                variant="primary"
                                onClick={() => navigate('/admin/users/new')}
                            >
                                + New user
                            </Button>
                        </div>
                    </div>
                    <AdminUserList
                        users={filteredUsers}
                        currentUserId={user?.id}
                        onDelete={handleDelete}
                    />
                </div>

                <div className="events-card">
                    <div className="card-header">
                        <h2>All Events</h2>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search events..."
                            value={eventSearchTerm}
                            onChange={(e) => setEventSearchTerm(e.target.value)}
                        />
                    </div>
                    <AdminEventsList
                        events={filteredEvents}
                        onDelete={handleDeleteEvent}
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;