import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { FaToolbox, FaChartBar, FaCalendarAlt, FaHardHat, FaCogs } from 'react-icons/fa';
import KanbanBoard from './components/KanbanBoard';
import CalendarView from './components/CalendarView';
import Reports from './components/Reports';
import EquipmentList from './components/EquipmentList';
import Login from './components/Login';
import { setAuthToken } from './services/api';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app startup, always check authentication first
    const checkAuth = () => {
      const token = localStorage.getItem('gearguard_token');
      const storedUser = localStorage.getItem('gearguard_user');

      if (token && storedUser) {
        try {
          // Token and user exist, authenticate
          setAuthToken(token);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (error) {
          // Invalid data, clear and show login
          localStorage.removeItem('gearguard_token');
          localStorage.removeItem('gearguard_user');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // No valid session, ensure login page shows
        localStorage.removeItem('gearguard_token');
        localStorage.removeItem('gearguard_user');
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <Router>
      {isAuthenticated ? (
        <div className="app">
          <nav className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <div className="logo">
              <FaToolbox />
              <h1>GearGuard</h1>
            </div>
            <div className="nav-menu">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <FaChartBar /> Kanban Board
              </NavLink>
              <NavLink to="/calendar" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <FaCalendarAlt /> Calendar
              </NavLink>
              <NavLink to="/equipment" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <FaHardHat /> Equipment
              </NavLink>
              <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <FaCogs /> Reports
              </NavLink>
            </div>
          </nav>

          <div className="main-content">
            <header className="top-bar">
              <button 
                className="toggle-sidebar"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                ☰
              </button>
              <h2>Maintenance Management System</h2>
              <div className="user-profile">
                <img src={user?.email ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}` : 'https://via.placeholder.com/40'} alt="user" />
                <div className="user-info">
                  <span className="user-name">{user?.name || 'Guest'}</span>
                  {user?.role && <span className="user-role">{user.role}</span>}
                </div>
                <button className="btn-ghost" onClick={() => { 
                  localStorage.removeItem('gearguard_token'); 
                  localStorage.removeItem('gearguard_user');
                  setIsAuthenticated(false);
                  setUser(null);
                  window.location.href = '/login'; 
                }}>Logout</button>
              </div>
            </header>

            <div className="content">
              <Routes>
                <Route path="/" element={<KanbanBoard />} />
                <Route path="/calendar" element={<CalendarView />} />
                <Route path="/equipment" element={<EquipmentList />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="loading-screen">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </>
      )}
    </Router>
  );
}

export default App;
