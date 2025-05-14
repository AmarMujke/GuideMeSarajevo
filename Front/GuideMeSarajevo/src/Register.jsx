import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./nav";
import api from "./api";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "USER" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register", formData);
      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data || "An error occurred");
    }
  };

  return (
    <>
      <Nav />
      <div className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
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
          <button type="submit">Register</button>
          {message && (
            <p className="message error">{message}</p>
          )}
          <p className="register-link">Already have an account? <Link to="/login">Login here</Link></p>
        </form>
      </div>
    </>
  );
};

export default Register;