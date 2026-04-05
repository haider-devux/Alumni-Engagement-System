import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css';

const batchYears = Array.from({ length: 40 }, (_, i) => 1985 + i); // 1985-2024

const facultyOptions = [
  'Faculty of Engineering',
  'Faculty of Science',
  'Faculty of Business and Management Science',
  'Faculty of Humanities and Social Sciences'
];

const degreeOptions = [
  'BS Economics with Data Science',
  'BS Management & Technology',
  'BS Financial Technology',
  'BS Computer Engineering',
  'BS Electrical Engineering',
  'BS Computer Science',
  'BS Software Engineering',
  'BS Artificial Intelligence',
  'Executive MBA (EMBA)',
  'MS Development Studies',
  'MS Public Policy and Society',
  'MS Management and Technology',
  'MS Data Science',
  'MS Computer Science',
  'MS Electrical Engineering',
  'MS Computer Engineering',
  'PhD Computer Science',
  'PhD Electrical Engineering'
];

const LoginForm = ({
  onSubmit,
  title = 'Login',
  error,
  mode = 'login',
  onModeSwitch
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [faculty, setFaculty] = useState('');
  const [degree, setDegree] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('Alumni'); // Default to Alumni

  const navigate = useNavigate();

  // Email regex
  const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

  const validateSignup = () => {
    if (!name || !email || !password || !confirmPassword || !rollNumber || !batchYear || !faculty || !degree) {
      setFormError('All fields are required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setFormError('Invalid email format');
      return false;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (mode === 'signup') {
      if (!validateSignup()) return;
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, rollNumber, batchYear, faculty, degree })
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
          setFormError(data.error || 'Registration failed');
        } else {
          alert('Registration successful! You can now log in.');
          window.location.href = '/login';
        }
      } catch (err) {
        setLoading(false);
        setFormError('Server error. Please try again later.');
      }
    } else {
      // Login
      if (!email || !password) {
        setFormError('Email and password are required');
        return;
      }
      // Call parent handler only, now with role
      onSubmit({ email, password, role });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>{title}</h2>
      {(formError || error) && <div className="error">{formError || error}</div>}
      {mode === 'signup' && (
        <>
          <div>
            <label htmlFor="name">Full Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div>
          <label htmlFor="rollNumber">Roll Number:</label>
          <input
            id="rollNumber"
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
            placeholder="Enter your roll number"
           />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your password"
            />
          </div>
          <div>
            <label htmlFor="batchYear">Batch Year:</label>
            <select
              id="batchYear"
              value={batchYear}
              onChange={(e) => setBatchYear(e.target.value)}
              required
            >
              <option value="">Select year</option>
              {batchYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="faculty">Faculty:</label>
            <select
              id="faculty"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              required
            >
              <option value="">Select faculty</option>
              {facultyOptions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="degree">Degree / Department:</label>
            <select
              id="degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              required
            >
              <option value="">Select program</option>
              {degreeOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </>
      )}
      {mode === 'login' && (
        <>
          <div>
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="MainAdmin">MainAdmin</option>
              <option value="Subadmin">Subadmin</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
        </>
      )}
      <button type="submit" disabled={loading}>{loading ? 'Please wait...' : (mode === 'signup' ? 'Sign Up' : 'Login')}</button>
      <div className="form-switch">
        {mode === 'login' ? (
          <>
            <span>Don't have an account?</span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/signup')}
              style={{ marginLeft: '0.7rem' }}
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            <span>Already have an account?</span>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/login')}
              style={{ marginLeft: '0.7rem' }}
            >
              Login
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default LoginForm;
