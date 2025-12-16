import { useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useAuth } from '../../../authentication/AuthContext';

// interface for admin mode
interface RegisterPageProps {
    adminMode?: boolean;
    onSucces?: () => void;
}

const RegisterPage = ({ adminMode = false, onSucces }: RegisterPageProps) => {
    const navigate = useNavigate();
    const { register, user } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        jobTitle: '',
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
            // Register call
            const response = await register({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                jobTitle: formData.jobTitle,
                role: formData.role,
                companyId,
                departmentId,
                workplaceId
            });

            console.log('Registratie succesvol!', response);

            // redirect updated with admin checks
            if (adminMode && onSucces) {
                onSucces();
            } else if (adminMode) {
                navigate('/admin');
            } else {
                navigate('/');
            }

            // Redirect naar dashboard
            // navigate('/');
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

    // if its not in adminmode then show norrmal registerpage
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

                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Loading...
                                                </>
                                            ) : (
                                                'Registreren'
                                            )}
                                        </button>

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
                <button className='btn btn-secondary' onClick={() => navigate('/admin')}>
                    ← Back
                </button>
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

                {/* Email - volle breedte */}
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

                {/* Telefoon + Functie in 2 kolommen */}
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

                {/* 👇 ROLE SELECTIE - ALLEEN ZICHTBAAR VOOR ADMINS */}
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
                            <option value="user">Gebruiker</option>
                            <option value="admin">Administrator</option>
                        </select>
                        <small className="text-muted d-block mt-1">
                            Administrators hebben volledige toegang tot het systeem
                        </small>
                    </div>
                )}

                {/* Wachtwoorden in 2 kolommen */}
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
                            Bevestig Wachtwoord <span className="text-danger">*</span>
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
                    <button
                        type="submit"
                        className='btn btn-primary'

                    >
                        {loading ? (
                            <>
                                <span className='spinner-borderr spinner-border-sm me-2'></span>
                                ...Loading
                            </>
                        ) : (
                            'Create user'
                        )}
                    </button>
                    <button
                        type='button'
                        className='btn btn-outline-secondery'
                        onClick={() => navigate('/admin')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;