import { useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { authService } from '../../../services/authService';



const RegisterPage = () => {
    const navigate = useNavigate();
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validatie
        if (formData.password !== formData.confirmPassword) {
            setError('Wachtwoorden komen niet overeen');
            return;
        }

        if (formData.password.length < 6) {
            setError('Wachtwoord moet minimaal 6 karakters zijn');
            return;
        }

        setLoading(true);

        try {
            // Gebruik authService in plaats van fetch!
            const response = await authService.register({
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

            // Redirect naar dashboard
            navigate('/dashboard');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Er ging iets mis. Probeer het later opnieuw.');
            }
            console.error('Register error:', err);
        } finally {
            setLoading(false);
        }
    };


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
};

export default RegisterPage;