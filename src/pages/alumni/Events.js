import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlumniNavbar from '../../components/AlumniNavbar';
import SubAdminNavbar from '../../components/SubAdminNavbar';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState({}); // {eventId: true/false}
  const [rsvpLoading, setRsvpLoading] = useState({}); // {eventId: true/false}
  const user = JSON.parse(localStorage.getItem('user'));

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

  // Fetch RSVP status for all events for the current user
  const fetchRsvpStatus = async (eventsList) => {
    if (!user) return;
    const statusObj = {};
    await Promise.all(eventsList.map(async (event) => {
      try {
        const res = await fetch(`http://localhost:5000/api/rsvp/${event.id}/${user.id}`);
        const data = await res.json();
        statusObj[event.id] = data.rsvped;
      } catch {
        statusObj[event.id] = false;
      }
    }));
    setRsvpStatus(statusObj);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length && user) {
      fetchRsvpStatus(events);
    }
  }, [events, user]);

  const handleRsvp = async (eventId) => {
    if (!user) return;
    setRsvpLoading(prev => ({ ...prev, [eventId]: true }));
    try {
      const res = await fetch('http://localhost:5000/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, user_id: user.id })
      });
      if (res.ok) {
        setRsvpStatus(prev => ({ ...prev, [eventId]: true }));
      }
    } catch {}
    setRsvpLoading(prev => ({ ...prev, [eventId]: false }));
  };

  const isUpcoming = (date) => new Date(date) >= new Date();

  const filteredEvents = events
    .filter(event => {
      if (filter === 'upcoming') return isUpcoming(event.date);
      if (filter === 'past') return !isUpcoming(event.date);
      return true;
    })
    .filter(event =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Check user type to determine which navbar to show
  const isSubAdmin = !!localStorage.getItem('subadmin');
  const isAlumni = !!localStorage.getItem('user');

  return (
    <>
      {isSubAdmin ? <SubAdminNavbar /> : isAlumni ? <AlumniNavbar showBackButton={true} backTo="/dashboard" /> : <AlumniNavbar />}
      <div className="container" style={{ paddingTop: '130px', paddingBottom: '20px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Events Directory</h2>
        
        <div className="events-main-layout">
          {/* Events List */}
          <div className="events-list">
            <div className="events-filter-bar">
              <label>
                <span style={{ marginRight: 8 }}>Show:</span>
                <select value={filter} onChange={e => setFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </label>
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {loading ? (
              <div style={{ textAlign: 'center' }}>Loading events...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : filteredEvents.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888' }}>No events found.</div>
            ) : (
              filteredEvents.map(event => (
                <div key={event.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 20, boxShadow: '0 2px 8px #f0f0f0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 24 }}>📅 <b>{event.title}</b></div>
                  <div><b>Date:</b> {new Date(event.date).toLocaleDateString()}</div>
                  <div><b>Location:</b> {event.location}</div>
                  <div style={{ color: '#555' }}>{event.description}</div>
                  <Link to={`/events/${event.id}`} className="btn btn-primary" style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                    View Details
                  </Link>
                  {user && (
                    rsvpStatus[event.id] ? (
                      <button
                        className="rsvp-btn rsvp-done"
                        disabled
                        style={{ marginTop: 8, alignSelf: 'flex-start' }}
                      >
                        RSVP'd
                      </button>
                    ) : (
                      <button
                        className="rsvp-btn"
                        style={{ marginTop: 8, alignSelf: 'flex-start' }}
                        onClick={() => handleRsvp(event.id)}
                        disabled={rsvpLoading[event.id]}
                      >
                        {rsvpLoading[event.id] ? 'Reserving...' : 'RSVP'}
                      </button>
                    )
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Events;
