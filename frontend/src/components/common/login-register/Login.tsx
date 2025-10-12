import { useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { authService } from '../../../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password);
    setError('')
    setIsLoading(true);

    try {
      const data = await authService.login(email, password);
      console.log('Login succes!', data);

      navigate('/dashbooard');

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Login mislukt, controleer je gegevens.');
      } else {
        setError('Login mislukt, controleer je gegevens.');
      }
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Login</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="login-container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;