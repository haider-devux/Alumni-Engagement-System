import React, { useState } from 'react';
import '../styles/main.css';

const EventForm = ({ onSubmit, onEventPosted }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(localStorage.getItem('subadmin'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title || !description || !date || !location) {
      setError('All fields are required');
      return;
    }
    if (!user || !user.id) {
        setError('You must be logged in to post an event.');
        return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          title,
          description,
          date,
          location
        })
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || 'Failed to post event');
      } else {
        setSuccess('Event posted successfully!');
        setTitle('');
        setDescription('');
        setDate('');
        setLocation('');
        if (onEventPosted) {
          onEventPosted(); // Callback to refresh event list
        }
      }
    } catch (err) {
      setLoading(false);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Post a New Event</h3>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Event Description" rows={4} className="tweet-textarea" required />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} placeholder="Event Date" required />
      <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Event Location" required />
      {error && <div className="error">{error}</div>}
      {success && <div className="success-msg">{success}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
        {loading ? 'Posting...' : 'Post Event'}
      </button>
    </form>
  );
};

export default EventForm; 