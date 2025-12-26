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
    // get token and user
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [stats, setStats] = useState({
        total: 0, // total users
        admins: 0, // total admins
        users: 0 // normal users
    });
    // loading state
    const [loading, setLoading] = useState(true);
    // error state
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // check if user is admin
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }

        // if user is admin load datta
        loadData();
    }, [user, navigate]);

    const loadData = async () => {
        // Check token
        if (!token) return;
        // start loading indicator
        setLoading(true);

        try {
            // api call gets all users
            // moet miss authcontext worden of authservice (geen usersevice)
            const usersData = await adminService.getAllUsers(token);

            // save users in state
            setUsers(usersData);

            // load eventsData 
            const eventsData = await adminService.getAllEvents(token);
            setEvents(eventsData);

        } catch (err: any) {
            // if there is an error save it
            setError(err.message);
        } finally {
            // stop loading indicator
            setLoading(false);
        }
    };
    
    const handleDeleteEvent = async (id: number) => {
        // check token
        if (!token) return;
        
        // extra to make sure you want to delete
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }

        // try catch where u delete event or show error
        try {
            await adminService.deleteEvent(token, id);
            await loadData();
        } catch (err: any) {
            setError(err.message);
        }
    }

    const handleDelete = async (id: number) => {
        // check if we have a token
        if (!token) return;

        // Dont let admin delete himself
        if (id === user?.id) {
            alert('You can not delete yourself')
            return;
        }

        // double check
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            // delete user with api call
            await adminService.deleteUser(token, id);

            await loadData();
        } catch (err: any) {
            setError(err.message);
        }
    };

    // filter users on input
    // Searches in name, email and function
    const filteredUsers = users.filter(u =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Bereken stats
    const totalUsers = users.length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    const userCount = users.filter(u => u.role === 'user').length;


    // loading and error states
    if (loading) return <div>...Loading</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 admin-header">
                <button
                    className='btn btn-primary'
                    onClick={() => navigate('/admin/users/new')}
                >
                    + New user
                </button>
            </div>
            {/* Stats Cards */}
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

            {/* Users Card  */}
            <div className="users-card">
                <div className="card-header">
                    <h2>All Users</h2>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Users List Component */}
                <AdminUserList
                    users={filteredUsers}
                    currentUserId={user?.id}
                    onDelete={handleDelete}
                />
                
                {/* Events list */}
                <div className="mt-2">
                    <AdminEventsList 
                        events={events}
                        onDelete={handleDeleteEvent}
                    />
                </div>

            </div>
        </div>
    )
}

export default AdminDashboard;