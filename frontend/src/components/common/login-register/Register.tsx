import { useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Button from '../UI/Buttons';
import { useAuth } from '../../../authentication/AuthContext';
import { adminService } from '../../../services/adminService';

// interface for admin mode
interface RegisterPageProps {
    adminMode?: boolean;
    onSuccess?: () => void;
}

const RegisterPage = ({ adminMode = false, onSuccess }: RegisterPageProps) => {
    const navigate = useNavigate();
    const { register, user, token } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        jobTitle: '',
        location: '',
        role: 'user',
    });
    const [companyId] = useState<number | null>(null);
    const [departmentId] = useState<number | null>(null);
    const [workplaceId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // check if user is logged in
    const isCurrentUserAdmin = user?.role === 'admin';
    const showRoleField = adminMode && isCurrentUserAdmin;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Wrong password');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password has to be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            if (adminMode && token) {
                // Admin creates user through adminService
                await adminService.createUser(token, {
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber,
                    jobTitle: formData.jobTitle,
                    location: formData.location,
                    role: formData.role,
                    companyId,
                    departmentId,
                    workplaceId
                });

                console.log('User aangemaakt door admin');

                if (onSuccess) {
                    onSuccess();
                } else {
                    navigate('/admin');
                }
            } else {
                // Normale registratie
                await register({
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber,
                    jobTitle: formData.jobTitle,
                    location: formData.location,
                    role: formData.role,
                    companyId,
                    departmentId,
                    workplaceId
                });

                console.log('Registratie succesvol!');
                navigate('/');
            }

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong, you can try again later.');
            }
            console.error('Register error:', err);
        } finally {
            setLoading(false);
        }
    };

    // if its not in adminmode then show normal registerpage
    if (!adminMode) {
        return (
            <div>
                <Header />
                <div className="container py-5 mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-4 col-lg-6">
                            <div className="card shadow">
                                <div className="card-body p-4">
                                    <h1 className="card-title text-center mb-4">Registrate</h1>

                                    {error && (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleRegister}>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="firstName" className="form-label">
                                                    Firstname
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="firstName"
                                                    name="firstName"
                                                    placeholder="Firstname"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="lastName" className="form-label">
                                                    Lastname
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="lastName"
                                                    name="lastName"
                                                    placeholder="Lastname"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                placeholder="name@example.nl"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="phoneNumber" className="form-label">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                placeholder="+31 6 12345678"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="jobTitle" className="form-label">
                                                Function
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="jobTitle"
                                                name="jobTitle"
                                                placeholder="Example: Developer"
                                                value={formData.jobTitle}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="location" className="form-label">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="location"
                                                name="location"
                                                placeholder="Example: Amsterdam"
                                                value={formData.location}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                name="password"
                                                placeholder="Min 6 Characters"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="confirmPassword" className="form-label">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                placeholder="Repeat Password.."
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={loading}
                                            className="w-100"
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Loading...
                                                </>
                                            ) : (
                                                'Registers'
                                            )}
                                        </Button>

                                        <div className="text-center mt-3">
                                            <small className="text-muted">
                                                Already got an account? <a href="/login">Log in!</a>
                                            </small>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="admin-register-form">
            {/* Back btn */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Create a new user</h2>
                <Button variant="secondary" onClick={() => navigate('/admin')}>
                    ← Back
                </Button>
            </div>

            {/* Error message popup */}
            {error && (
                <div className="alert alert-danger" role='alert'>
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister}>
                {/* Naam velden in 2 kolommen */}
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

                {/* Email  */}
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

                {/* telephone + funcion */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="phoneNumber" className="form-label">
                            Telefoonnummer <span className="text-danger">*</span>
                        </label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="+31 6 12345678"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="jobTitle" className="form-label">
                            Functie <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="jobTitle"
                            name="jobTitle"
                            placeholder="Bijvoorbeeld: Developer"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                        Location
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        placeholder="Example: Amsterdam"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>

                {/* Role section */}
                {showRoleField && (
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
                        <small className="text-muted d-block mt-1">
                            Admins have full acces
                        </small>
                    </div>
                )}

                {/* passwords in 2 columns */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="password" className="form-label">
                            Wachtwoord <span className="text-danger">*</span>
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Min 6 tekens"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm password <span className="text-danger">*</span>
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Herhaal wachtwoord"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className='spinner-border spinner-border-sm me-2'></span>
                                ...Loading
                            </>
                        ) : (
                            'Create user'
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

export default RegisterPage;