import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LoginForm from '../../components/LoginForm';

const LoginAlumni = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async ({ email, password, role }) => {
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (role === 'Alumni') {
      // Alumni login (existing backend logic)
      try {
        const res = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Login failed');
        } else {
          setSuccess('Login successful! Redirecting to dashboard...');
          localStorage.setItem('user', JSON.stringify(data.user));
          setTimeout(() => navigate('/dashboard'), 1000);
        }
      } catch (err) {
        setError('Server error. Please try again later.');
      }
    } else if (role === 'MainAdmin') {
      // Hardcoded MainAdmin credentials
      if (email === 'mainadmin@admin.com' && password === 'mainadmin123') {
        setSuccess('MainAdmin login successful! Redirecting...');
        setTimeout(() => navigate('/main-admin'), 1000);
      } else {
        setError('Invalid MainAdmin credentials.');
      }
    } else if (role === 'Subadmin') {
      // Subadmin login using backend
      try {
        const res = await fetch('http://localhost:5000/api/login-subadmin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Invalid Subadmin credentials.');
        } else {
          setSuccess('Subadmin login successful! Redirecting...');
          localStorage.setItem('subadmin', JSON.stringify(data.subadmin));
          setTimeout(() => navigate('/sub'), 1000);
        }
      } catch (err) {
        setError('Server error. Please try again later.');
      }
    } else {
      setError('Invalid role selected.');
    }
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {success && <div className="success" style={{ color: 'green', marginBottom: 16 }}>{success}</div>}
        <LoginForm
          onSubmit={handleLogin}
          title={'Login to Alumni Connect'}
          error={error}
          mode={'login'}
          onModeSwitch={() => {}}
        />
      </div>
    </div>
  );
};

export default LoginAlumni; 