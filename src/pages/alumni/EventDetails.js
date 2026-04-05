import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AlumniNavbar from '../../components/AlumniNavbar';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rsvped, setRsvped] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:5000/api/events`);
        const data = await res.json();
        const found = data.find(e => String(e.id) === String(id));
        setEvent(found);
      } catch {
        setError('Failed to fetch event');
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    const fetchRsvp = async () => {
      if (!user || !event) return;
      try {
        const res = await fetch(`http://localhost:5000/api/rsvp/${event.id}/${user.id}`);
        const data = await res.json();
        setRsvped(data.rsvped);
      } catch {
        setRsvped(false);
      }
    };
    fetchRsvp();
  }, [event, user]);

  const handleRsvp = async () => {
    if (!user || !event) return;
    setRsvpLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: event.id, user_id: user.id })
      });
      if (res.ok) setRsvped(true);
    } catch {}
    setRsvpLoading(false);
  };

  if (loading) {
    return (
      <>
        <AlumniNavbar />
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
          <h2 className="section-title">Loading event...</h2>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <AlumniNavbar />
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
          <h2 className="section-title">Event Not Found</h2>
          <Link to="/events" className="btn btn-secondary" style={{ marginTop: 24 }}>Back to Events</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <AlumniNavbar />
      <div className="container" style={{ paddingTop: '120px', maxWidth: 600, paddingBottom: '30px' }}>
        <div className="feature-card" style={{ minHeight: 320, padding: '2.5rem 2rem' }}>
          <div className="feature-icon">📅</div>
          <h2 style={{ color: '#1e40af', marginBottom: 12 }}>{event.title}</h2>
          <p><b>Date:</b> {event.date ? new Date(event.date).toLocaleDateString() : ''}</p>
          <p><b>Location:</b> {event.location}</p>
          <p style={{ margin: '1.5rem 0' }}>{event.description}</p>
          {user && (
            rsvped ? (
              <button className="btn btn-secondary" disabled style={{ marginRight: 16 }}>RSVP'd</button>
            ) : (
              <button className="btn btn-primary" style={{ marginRight: 16 }} onClick={handleRsvp} disabled={rsvpLoading}>
                {rsvpLoading ? 'Reserving...' : 'RSVP'}
              </button>
            )
          )}
          <Link to="/events" className="btn btn-outline">Back to Events</Link>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
