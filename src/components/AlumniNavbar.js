import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AlumniNavbar = ({ showBackButton = false, backTo = '/dashboard' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/home');
  };

  const handleBack = () => {
    navigate(backTo);
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar enhanced-navbar">
      <div className="nav-container">
        {/* Back Button */}
        {showBackButton && (
          <button 
            onClick={handleBack}
            className="back-button"
            aria-label="Go back"
            title="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back
          </button>
        )}

        {/* Left: Logo */}
        <div className="nav-logo">
          <Link to="/dashboard" className="nav-logo-link" aria-label="ITU Alumni Dashboard">
            <div className="logo-container">
              <span className="logo-text">ITU Alumni</span>
            </div>
          </Link>
        </div>

        {/* Center: Main navigation links */}
        <div className="nav-menu">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActivePage('/dashboard') ? 'active' : ''}`}
            aria-label="Dashboard"
          >
            Dashboard
          </Link>
          <Link 
            to="/events" 
            className={`nav-link ${isActivePage('/events') ? 'active' : ''}`}
            aria-label="Events"
          >
            Events
          </Link>
          <Link 
            to="/jobs" 
            className={`nav-link ${isActivePage('/jobs') ? 'active' : ''}`}
            aria-label="Jobs"
          >
            Jobs
          </Link>
          <Link 
            to="/postjob" 
            className={`nav-link ${isActivePage('/postjob') ? 'active' : ''}`}
            aria-label="Post Jobs"
          >
            Post Jobs
          </Link>
          <Link 
            to="/post-events" 
            className={`nav-link ${isActivePage('/post-events') ? 'active' : ''}`}
            aria-label="Post Events"
          >
            Post Events
          </Link>
        </div>

        {/* Right: User menu */}
        <div className="nav-user-menu">
          <div className="user-info">
            <span className="user-greeting">Hello, {user?.name || 'Alumni'}!</span>
          </div>
          <Link 
            to="/profile" 
            className={`nav-link profile-link ${isActivePage('/profile') ? 'active' : ''}`}
            aria-label="Profile"
          >
            Profile
          </Link>
          <button 
            className="nav-link logout-btn" 
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
          >
            Logout
          </button>
        </div>

        {/* Hamburger for mobile */}
        <button 
          className="hamburger" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="nav-menu-mobile">
          {showBackButton && (
            <button 
              onClick={() => { handleBack(); toggleMobileMenu(); }}
              className="mobile-back-button"
            >
              ← Back
            </button>
          )}
          <div className="mobile-user-info">
            <span>Hello, {user?.name || 'Alumni'}!</span>
          </div>
          <Link to="/dashboard" className={`mobile-nav-link ${isActivePage('/dashboard') ? 'active' : ''}`} onClick={toggleMobileMenu}>
            Dashboard
          </Link>
          <Link to="/events" className={`mobile-nav-link ${isActivePage('/events') ? 'active' : ''}`} onClick={toggleMobileMenu}>
            Events
          </Link>
          <Link to="/jobs" className={`mobile-nav-link ${isActivePage('/jobs') ? 'active' : ''}`} onClick={toggleMobileMenu}>
            Jobs
          </Link>
          <Link to="/postjob" className={`mobile-nav-link ${isActivePage('/postjob') ? 'active' : ''}`} onClick={toggleMobileMenu}>
            Post Jobs
          </Link>
          <Link to="/post-events" className={`mobile-nav-link ${isActivePage('/post-events') ? 'active' : ''}`} onClick={toggleMobileMenu}>
            Post Events
          </Link>
          <Link to="/profile" className={`mobile-nav-link ${isActivePage('/profile') ? 'active' : ''}`} onClick={toggleMobileMenu}>
            Profile
          </Link>
          <button className="mobile-nav-link logout-btn" onClick={() => { handleLogout(); toggleMobileMenu(); }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default AlumniNavbar;