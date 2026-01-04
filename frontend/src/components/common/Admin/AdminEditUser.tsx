import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../../authentication/AuthContext';
import Button from '../UI/Buttons';
import { adminService, type UpdateUserPayload } from '../../../../../frontend/src/services/adminService';
import '../../../styles/Admin/AdminDashboard.css';

const AdminEditUser = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<UpdateUserPayload>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        jobTitle: '',
        location: '',
        role: 'user',
        companyId: null,
        departmentId: null,
        workplaceId: null,
    });

    useEffect(() => {
        if (!token || !id) {
            navigate('/admin');
            return;
        }

        // Check if user is admin
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }

        loadUser();
    }, [id, token, user, navigate]);

    const loadUser = async () => {
        if (!token || !id) return;

        try {
            const userData = await adminService.getUserById(token, parseInt(id));
            setFormData({
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: '', // Leeg - alleen invullen als je wachtwoord wilt wijzigen
                phoneNumber: userData.phoneNumber || '',
                jobTitle: userData.jobTitle || '',
                location: userData.location || '',
                role: userData.role,
                companyId: null,
                departmentId: null,
                workplaceId: null,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to load user');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        if (!token || !id) return;

        try {
            // Als password leeg is, verwijder het uit de payload
            const payload: UpdateUserPayload = { ...formData };
            if (!payload.password || payload.password.trim() === '') {
                delete payload.password;
            }

            await adminService.updateUser(token, parseInt(id), payload);
            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-register-form">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Edit user</h2>
                <Button variant="secondary" onClick={() => navigate('/admin')}>
                    ← Back
                </Button>
            </div>

            {error && (
                <div className="alert alert-danger" role='alert'>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="firstName" className="form-label">
                            Voornaam <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label">
                            Achternaam <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email <span className="text-danger">*</span>
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="phoneNumber" className="form-label">
                            Telefoonnummer
                        </label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="+31 6 12345678"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="jobTitle" className="form-label">
                            Functie
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="jobTitle"
                            name="jobTitle"
                            placeholder="Bijvoorbeeld: Developer"
                            value={formData.jobTitle}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                        Locatie
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                        Rol <span className="text-danger">*</span>
                    </label>
                    <select
                        className="form-select"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Nieuw wachtwoord (laat leeg om niet te wijzigen)
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Min 6 tekens"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="d-flex gap-2">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <span className='spinner-border spinner-border-sm me-2'></span>
                                Saving...
                            </>
                        ) : (
                            'Save changes'
                        )}
                    </Button>
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => navigate('/admin')}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminEditUser;