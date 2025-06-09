import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Nav from "./nav";
import api from "../helpers/api"; 
import "./Login.css";
import Footer from "./footer";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "", userId: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', formData);
      const response = await api.post("/api/auth/login", formData);
      console.log('Login response:', response.data);
  
      login(response.data);
  
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("userId", response.data.userId); 
  
      console.log('After login - localStorage:', {
        token: localStorage.getItem('token'),
        email: localStorage.getItem('email'),
        userId: localStorage.getItem('userId')
      });
  
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.response?.data || "An error occurred");
    }
  };  

  return (
    <>
      <Nav />
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit">Login</button>
          {message && <p className="message error">{message}</p>}
          <p className="register-link">
            {"Don't have an account? "} <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;