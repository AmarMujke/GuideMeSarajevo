import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return !!savedToken;
  });
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');
    return savedToken ? { token: savedToken, email: savedEmail } : null;
  });

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('email', userData.email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  };

  // Check token validity on mount and periodically
  useEffect(() => {
    const checkAuth = async () => {
      if (user?.token) {
        try {
          await api.get('/api/auth/validate');
          // If we get here, the token is valid
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 