import { useState } from 'react';

const registerPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');


    const handleRegister = () => {
        console.log('Register:', { email, password, confirmPassword, name})

    };

    return (
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
                name="" 
                id="" />
            </div>
        </div>
    )
}