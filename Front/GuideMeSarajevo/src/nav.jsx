import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./nav.css";

function Nav() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current login state:', isLoggedIn);
    console.log('Local Storage:', {
      token: localStorage.getItem('token'),
      email: localStorage.getItem('email')
    });
  }, [isLoggedIn]);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <h1>GuideMeSarajevo</h1>
      </Link>
      <nav>
        <ul className={isNavOpen ? "navList show" : "navList"}>
          <li>
            <Link to="/tours">Tours</Link>
          </li>
          <li>
            <Link to="/transport">Transport</Link>
          </li>
          <li>
            {isLoggedIn ? (
              <div className="profile-section">
                <Link to="/profile" className="profile-link">
                  <i className="fas fa-user-circle"></i>
                </Link>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-button">
                Login
              </Link>
            )}
          </li>
        </ul>
        <div className="navToggle">
          <button onClick={toggleNav}>&#9776;</button>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
