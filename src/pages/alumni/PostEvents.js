import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlumniNavbar from '../../components/AlumniNavbar';
import EventForm from '../../components/EventForm';
import '../../styles/main.css';

const PostEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError('Failed to fetch events');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="home-container" style={{ minHeight: '100vh', background: 'var(--oxford-light)' }}>
      <AlumniNavbar showBackButton={true} backTo="/dashboard" />
      <div style={{ marginTop: 100, padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 24 }}>Post Events</h1>
        
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 40, flex: 1, width: '100%', maxWidth: 1200 }}>
          {/* Post Event Section */}
          <section className="section" style={{ 
            width: 350, 
            minWidth: 280, 
            flex: '1 1 350px', 
            maxWidth: 400, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-start', 
            overflowY: 'auto', 
            minHeight: 0 
          }}>
            <EventForm onEventPosted={fetchEvents} />
          </section>

          {/* All Events Section */}
          <section className="section alumni-tweets-scrollable" style={{ 
            width: 600, 
            minWidth: 300, 
            flex: '2 1 600px', 
            maxWidth: 700, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 24, flex: '0 0 auto' }}>
              All Events
            </h2>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', maxHeight: '70vh' }}>
              {loading ? (
                <div>Loading events...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : events.length === 0 ? (
                <div>No events posted yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {events.map(event => (
                    <div key={event.id} className="card tweet-card">
                      <div className="tweet-author">
                        {event.title} <span className="tweet-email">@ {event.name} ({event.email})</span>
                      </div>
                      <div className="tweet-content">{event.description}</div>
                      <div className="tweet-date">
                        {event.location ? event.location + ' | ' : ''}
                        {event.date ? new Date(event.date).toLocaleDateString() + ' | ' : ''}
                        {event.created_at ? new Date(event.created_at).toLocaleString() : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PostEvents;
