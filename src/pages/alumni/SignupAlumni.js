import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LoginForm from '../../components/LoginForm';

const SignupAlumni = () => {
  const [error, setError] = useState('');
  const [formMode] = useState('signup');
  const navigate = useNavigate();

  const handleSignUp = async (fields) => {
    if (fields.error) {
      setError(fields.error);
      return;
    }
    const { name, email, password, rollNumber, batchYear, faculty, degree } = fields;
    if (!name || !email || !password || !rollNumber || !batchYear || !faculty || !degree) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, rollNumber, batchYear, faculty, degree })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }
      // Auto-login after successful registration
      const loginRes = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setError('Registration succeeded, but login failed. Please try logging in.');
        return;
      }
      localStorage.setItem('user', JSON.stringify(loginData.user));
      navigate('/dashboard');
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      {/* Sign Up Form Section */}
      <div className="login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoginForm
          onSubmit={handleSignUp}
          title={'Sign Up for Alumni Connect'}
          error={error}
          mode={formMode}
          onModeSwitch={() => {}}
        />
      </div>
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Alumni Connect</h3>
              <p>Building bridges between past, present, and future.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <Link to="/directory">Alumni Directory</Link>
                </li>
                <li>
                  <Link to="/events">Events</Link>
                </li>
                <li>
                  <Link to="/jobs">Job Board</Link>
                </li>
                <li>
                  <Link to="/admin-panel">Admin</Link>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Account</h4>
              <ul>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Register</Link>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li>
                  <a href="#help">Help Center</a>
                </li>
                <li>
                  <a href="#contact">Contact Us</a>
                </li>
                <li>
                  <a href="#privacy">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Alumni Engagement System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignupAlumni; 