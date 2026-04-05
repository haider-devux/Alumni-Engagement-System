import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper to check login for any role
  const isAnyLoggedIn = () => {
    return (
      localStorage.getItem('user') ||
      localStorage.getItem('subadmin') ||
      localStorage.getItem('mainadmin')
    );
  };


  const isSubadmin = () => !!localStorage.getItem('subadmin');

  // Handler for protected navigation
  const handleProtectedNav = (path) => (e) => {
    if (!isAnyLoggedIn()) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0 }}>
        {/* Left: Logo */}
        <div className="nav-logo" style={{ flex: '0 0 auto' }}>
          <Link to="/" className="nav-logo-link">
            <span className="logo-text">ITU Alumni</span>
          </Link>
        </div>

        {/* Center: Main navigation links */}
        <div className="nav-menu" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '2.5rem' }}>
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/events" className="nav-link" onClick={handleProtectedNav('/events')}>Events</Link>
          <Link to="/directory" className="nav-link" onClick={handleProtectedNav('/directory')}>Directory</Link>
          <Link to="/jobs" className="nav-link" sonClick={handleProtectedNav('/jobs')}>Jobs</Link>
          <Link to="/post-job" className="nav-link" onClick={handleProtectedNav('/post-job')}>Post Jobs</Link>
        </div>

        {/* Right: User/account links */}
        <div className="nav-user-menu" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {isAnyLoggedIn() ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={handleProtectedNav('/dashboard')}>Dashboard</Link>
              <Link to="/profile" className="nav-link" onClick={handleProtectedNav('/profile')}>Profile</Link>
              <button className="nav-link logout-btn" onClick={() => { setIsLoggedIn(false); localStorage.clear(); navigate('/login'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link register-btn">Register</Link>
            </>
          )}
        </div>

        {/* Hamburger for mobile */}
        <div className="hamburger" onClick={toggleMobileMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
      {/* Mobile menu (optional: can be improved for full mobile support) */}
      {isMobileMenuOpen && (
        <div className="nav-menu-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', background: 'var(--oxford-white)', padding: '1.5rem', position: 'absolute', top: 70, left: 0, right: 0, zIndex: 2000, boxShadow: '0 2px 12px rgba(10, 23, 78, 0.07)' }}>
          <Link to="/home" className="nav-link" onClick={toggleMobileMenu}>Home</Link>
          <Link to="/events" className="nav-link" onClick={e => { handleProtectedNav('/events')(e); toggleMobileMenu(); }}>Events</Link>
          <Link to="/directory" className="nav-link" onClick={e => { handleProtectedNav('/directory')(e); toggleMobileMenu(); }}>Directory</Link>
          <Link to="/jobs" className="nav-link" onClick={e => { handleProtectedNav('/jobs')(e); toggleMobileMenu(); }}>Jobs</Link>
          <Link to="/post-job" className="nav-link" onClick={e => { handleProtectedNav('/post-job')(e); toggleMobileMenu(); }}>Post Jobs</Link>
          {isAnyLoggedIn() ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={e => { handleProtectedNav('/dashboard')(e); toggleMobileMenu(); }}>Dashboard</Link>
              <Link to="/profile" className="nav-link" onClick={e => { handleProtectedNav('/profile')(e); toggleMobileMenu(); }}>Profile</Link>
              <button className="nav-link logout-btn" onClick={() => { setIsLoggedIn(false); localStorage.clear(); navigate('/login'); toggleMobileMenu(); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={toggleMobileMenu}>Login</Link>
              <Link to="/signup" className="nav-link register-btn" onClick={toggleMobileMenu}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 