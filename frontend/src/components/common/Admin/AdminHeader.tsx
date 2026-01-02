// src/components/common/Admin/AdminHeader.tsx
import { useNavigate } from 'react-router';
import Button from '../UI/Buttons'; 

const AdminHeader = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">User Management</h1>
            <Button variant='primary' onClick={() => navigate('/admin/users/new')}>
                + Add User
            </Button>
        </div>
    );
};

export default AdminHeader;