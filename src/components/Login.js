import React, { useState } from 'react';
import { authService, setAuthToken } from '../services/api';
import { FaToolbox, FaLock, FaEnvelope } from 'react-icons/fa';
import '../styles/Login.css';

const Login = ({ setIsAuthenticated, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      const { token, user } = res.data;
      if (!token) throw new Error('No token returned');
      localStorage.setItem('gearguard_token', token);
      setAuthToken(token);
      localStorage.setItem('gearguard_user', JSON.stringify(user));
      
      // Update parent component state
      if (setIsAuthenticated) setIsAuthenticated(true);
      if (setUser) setUser(user);
      
      // Navigate to home
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      <div className="login-content">
        <div className="login-brand">
          <div className="brand-icon">
            <FaToolbox />
          </div>
          <h1>GearGuard</h1>
          <p className="brand-tagline">Maintenance Management System</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue to your dashboard</p>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="label-icon" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="john.smith@company.com"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="label-icon" />
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button 
            className="btn-login" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="login-footer">
            <div className="credentials-box">
              <p className="credentials-title">Demo Credentials</p>
              <div className="credential-item">
                <span className="credential-role">Manager / Admin</span>
                <span className="credential-details">john.smith@company.com / password123</span>
              </div>
              <div className="credential-item">
                <span className="credential-role">Technician</span>
                <span className="credential-details">sarah.johnson@company.com / password123</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
