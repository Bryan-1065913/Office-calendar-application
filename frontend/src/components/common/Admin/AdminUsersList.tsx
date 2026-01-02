// src/components/common/Admin/UsersList.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User } from '../../../services/adminService';
import Button from '../UI/Buttons'; 
import '../../../styles/Admin/UsersList.css';

interface UsersListProps {
    users: User[];
    currentUserId?: number;
    onDelete: (id: number) => void;
}

const UsersList = ({ users, currentUserId, onDelete }: UsersListProps) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(u =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="card">
            <div className="card-body">
                {/* Users List */}
                <div className="users-scroll">
                    {filteredUsers.length === 0 ? (
                        <p className="text-center text-muted py-4">No users found</p>
                    ) : (
                        filteredUsers.map(u => (
                            <div key={u.id} className="d-flex align-items-center gap-3 p-3 border-bottom">
                                {/* Avatar */}
                                <div className="user-avatar">
                                    {u.firstName[0]}{u.lastName[0]}
                                </div>

                                {/* User info */}
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <span className="fw-semibold">{u.fullName}</span>
                                        <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>
                                            {u.role}
                                        </span>
                                    </div>
                                    <p className="text-muted mb-0 small">{u.email}</p>
                                    <p className="text-muted mb-0 small">{u.jobTitle || '-'}</p>
                                </div>

                                {/* Actions */}
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="secondary"
                                        onClick={() => navigate(`/admin/users/${u.id}/edit`)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => onDelete(u.id)}
                                        disabled={u.id === currentUserId}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsersList;