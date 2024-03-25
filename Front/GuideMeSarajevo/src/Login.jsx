import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const LoginForm = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/login', {
        userName: userName,
        password: password,
      });

      console.log('Login successful:', response.data);

    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <label>Username:</label>
        <input type="userName" value={userName} onChange={(e) => setUsername(e.target.value)} required />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
