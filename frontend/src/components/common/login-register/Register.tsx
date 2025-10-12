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
        role: 'Employee',
        companyId: 1, // Default data
        departmentId: 1, // Default data
        workplaceId: 1 // Default data
    });
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
                companyId: formData.companyId,
                departmentId: formData.departmentId,
                workplaceId: formData.workplaceId
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
            <div className="container">
                <h1>Registreren</h1>

                {error && <div className="error-message">{error}</div>}

                <form className="register-container" onSubmit={handleRegister}>
                    <label htmlFor="firstName">Voornaam</label>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Voornaam"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="lastName">Achternaam</label>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Achternaam"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="phoneNumber">Telefoonnummer</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="+31 6 12345678"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="jobTitle">Functie</label>
                    <input
                        type="text"
                        name="jobTitle"
                        placeholder="Bijvoorbeeld: Developer"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password">Wachtwoord</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Minimaal 6 karakters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="confirmPassword">Bevestig Wachtwoord</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Bevestig Wachtwoord"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Bezig met registreren...' : 'Registreren'}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default RegisterPage;