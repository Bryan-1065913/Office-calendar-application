import { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log(email, password);
  };
  return (
    <div>
      <Header />
      <div className="container">
        <h1>Login</h1>
        <div className="login-container">
          <label htmlFor="email">Email</label>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button>Login</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;