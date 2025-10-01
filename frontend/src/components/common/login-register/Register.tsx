import { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';


const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');


    const handleRegister = () => {
        console.log('Register:', { email, password, confirmPassword, name })

    };

    return (
        <div>
            <Header />
            <div className="container">

                <h1>Registrate</h1>

                <div className="register-container">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password">Wachtwoord</label>
                    <input
                        type="password"
                        placeholder="Wachtwoord"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label htmlFor="confirmPassword">Bevestig Wachtwoord</label>
                    <input
                        type="password"
                        placeholder="Bevestig Wachtwoord"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button onClick={handleRegister}>Registrate</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RegisterPage;