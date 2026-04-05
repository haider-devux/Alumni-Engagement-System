import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SubAdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('subadmin');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0 }}>
        {/* Left: Logo */}
        <div className="nav-logo" style={{ flex: '0 0 auto' }}>
          <Link to="/sub" className="nav-logo-link">
            <span className="logo-text">SubAdmin Panel</span>
          </Link>
        </div>

        {/* Center: Main navigation links */}
        <div className="nav-menu" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '2.5rem' }}>
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/events" className="nav-link">Events</Link>
          <Link to="/directory" className="nav-link">Directory</Link>
          <Link to="/jobs" className="nav-link">Jobs</Link>
          <Link to="/postjob" className="nav-link">Post Jobs</Link>
        </div>

        {/* Right: User/account links */}
        <div className="nav-user-menu" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/sub" className="nav-link">SubAdmin Panel</Link>
          <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        {/* Hamburger for mobile */}
        <div className="hamburger" onClick={toggleMobileMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="nav-menu-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', background: 'var(--oxford-white)', padding: '1.5rem', position: 'absolute', top: 70, left: 0, right: 0, zIndex: 2000, boxShadow: '0 2px 12px rgba(10, 23, 78, 0.07)' }}>
          <Link to="/home" className="nav-link" onClick={toggleMobileMenu}>Home</Link>
          <Link to="/events" className="nav-link" onClick={toggleMobileMenu}>Events</Link>
          <Link to="/directory" className="nav-link" onClick={toggleMobileMenu}>Directory</Link>
          <Link to="/jobs" className="nav-link" onClick={toggleMobileMenu}>Jobs</Link>
          <Link to="/postjob" className="nav-link" onClick={toggleMobileMenu}>Post Jobs</Link>
          <Link to="/sub" className="nav-link" onClick={toggleMobileMenu}>SubAdmin Panel</Link>
          <button className="nav-link logout-btn" onClick={() => { handleLogout(); toggleMobileMenu(); }}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default SubAdminNavbar;
