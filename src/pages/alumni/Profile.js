import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlumniNavbar from '../../components/AlumniNavbar';
import '../../styles/main.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    roll_number: '',
    batch_year: '',
    faculty: '',
    degree: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Fetch user info on mount (assume user is stored in localStorage after login)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(storedUser);
    setForm({
      name: storedUser.name || '',
      email: storedUser.email || '',
      roll_number: storedUser.roll_number || '',
      batch_year: storedUser.batch_year || '',
      faculty: storedUser.faculty || '',
      degree: storedUser.degree || ''
    });
    setLoading(false);
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/registered_alumni/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, password: password ? password : undefined })
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || 'Update failed');
      } else {
        setSuccess('Profile updated successfully!');
        localStorage.setItem('user', JSON.stringify({ ...user, ...form }));
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) {
      setLoading(false);
      setError('Server error. Please try again later.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="home-container">
      <AlumniNavbar showBackButton={true} backTo="/dashboard" />
      <section className="section" style={{ maxWidth: 600, margin: '50px auto' }}>
        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 24 }}>My Profile</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Name:</label>
          <input name="name" value={form.name} onChange={handleChange} required />
          <label>Email:</label>
          <input name="email" value={form.email} onChange={handleChange} required type="email" />
          <label>Roll Number:</label>
          <input name="roll_number" value={form.roll_number} onChange={handleChange} required />
          <label>Batch Year:</label>
          <input name="batch_year" value={form.batch_year} onChange={handleChange} required type="number" />
          <label>Faculty:</label>
          <input name="faculty" value={form.faculty} onChange={handleChange} required />
          <label>Degree:</label>
          <input name="degree" value={form.degree} onChange={handleChange} required />
          <label>New Password:</label>
          <input name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
          <label>Confirm New Password:</label>
          <input name="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" />
          {error && <div className="error">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 16 }}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Profile;
