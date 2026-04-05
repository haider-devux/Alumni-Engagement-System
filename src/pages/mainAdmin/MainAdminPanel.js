import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import '../../styles/main.css';
import Postjob from '../alumni/Postjob';
import EventForm from '../../components/EventForm';

const MainAdminPanel = () => {
  // Subadmin registration state
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subPassword, setSubPassword] = useState('');
  const [subError, setSubError] = useState('');
  const [subSuccess, setSubSuccess] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('registerSubadmin');

  // Directory state
  const [alumni, setAlumni] = useState([]);
  const [subadmins, setSubadmins] = useState([]);
  const [dirLoading, setDirLoading] = useState(false);
  const [dirError, setDirError] = useState('');

  // Events state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const fetchDirectory = async () => {
    setDirLoading(true);
    setDirError('');
    try {
      const [alumniRes, subadminsRes] = await Promise.all([
        fetch('http://localhost:5000/api/registered_alumni'),
        fetch('http://localhost:5000/api/subadmins'),
      ]);
      const alumniData = await alumniRes.json();
      const subadminsData = await subadminsRes.json();
      setAlumni(alumniData);
      setSubadmins(subadminsData);
    } catch (err) {
      setDirError('Failed to fetch directory');
    }
    setDirLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'directory') fetchDirectory();
    if (activeTab === 'postEvent') fetchEvents();
  }, [activeTab]);

  const handleSubadminRegister = async (e) => {
    e.preventDefault();
    setSubError('');
    setSubSuccess('');
    if (!subName || !subEmail || !subPassword) {
      setSubError('All fields are required');
      return;
    }
    setSubLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/register-subadmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: subName, email: subEmail, password: subPassword })
      });
      const data = await res.json();
      setSubLoading(false);
      if (!res.ok) {
        setSubError(data.error || 'Failed to register subadmin');
      } else {
        setSubSuccess('Subadmin registered successfully!');
        setSubName('');
        setSubEmail('');
        setSubPassword('');
      }
    } catch (err) {
      setSubLoading(false);
      setSubError('Server error. Please try again later.');
    }
  };

  return (
    <div className="home-container" style={{ minHeight: '100vh', background: 'var(--oxford-light)' }}>
      <Navbar />
      <div style={{ marginTop: 90, padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 24 }}>Main Admin Dashboard</h1>
        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-button ${activeTab === 'registerSubadmin' ? 'active' : ''}`}
            onClick={() => setActiveTab('registerSubadmin')}
          >
            Register Subadmin
          </button>
          <button
            className={`admin-tab-button ${activeTab === 'postEvent' ? 'active' : ''}`}
            onClick={() => setActiveTab('postEvent')}
          >
            Post Event
          </button>
          <button
            className={`admin-tab-button ${activeTab === 'postJob' ? 'active' : ''}`}
            onClick={() => setActiveTab('postJob')}
          >
            Post Job
          </button>
          <button
            className={`admin-tab-button ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('directory')}
          >
            Directory
          </button>
        </div>
        {/* Tab Content */}
        <div className="admin-tab-content">
          {activeTab === 'directory' && (
            <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'row', gap: 40, justifyContent: 'center', alignItems: 'flex-start' }}>
              {/* Subadmins List */}
              <section className="section" style={{ flex: 1, minWidth: 300 }}>
                <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 16 }}>Subadmins</h2>
                {dirLoading ? <div>Loading...</div> : dirError ? <div className="error">{dirError}</div> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {subadmins.length === 0 ? <div>No subadmins found.</div> : subadmins.map(sub => (
                      <div key={sub.id} className="card tweet-card">
                        <div className="tweet-author">{sub.name} <span className="tweet-email">({sub.email})</span></div>
                        <div className="tweet-date">Registered: {sub.created_at ? new Date(sub.created_at).toLocaleString() : ''}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              {/* Alumni List */}
              <section className="section" style={{ flex: 2, minWidth: 400 }}>
                <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 16 }}>Alumni</h2>
                {dirLoading ? <div>Loading...</div> : dirError ? <div className="error">{dirError}</div> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {alumni.length === 0 ? <div>No alumni found.</div> : alumni.map(alum => (
                      <div key={alum.id} className="card tweet-card">
                        <div className="tweet-author">{alum.name} <span className="tweet-email">({alum.email})</span></div>
                        <div className="tweet-date">Roll #: {alum.roll_number} | Batch: {alum.batch_year} | {alum.faculty} | {alum.degree}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'registerSubadmin' && (
            <section className="section">
              <h2 style={{ fontSize: '1.5rem', marginBottom: 16, textAlign: 'center' }}>Register a Subadmin</h2>
              <form onSubmit={handleSubadminRegister} className="login-form" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <input type="text" value={subName} onChange={e => setSubName(e.target.value)} placeholder="Full Name" required />
                <input type="email" value={subEmail} onChange={e => setSubEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={subPassword} onChange={e => setSubPassword(e.target.value)} placeholder="Password" required />
                {subError && <div className="error">{subError}</div>}
                {subSuccess && <div className="success-msg">{subSuccess}</div>}
                <button type="submit" className="btn btn-primary" disabled={subLoading} style={{ marginTop: 8 }}>{subLoading ? 'Registering...' : 'Register Subadmin'}</button>
              </form>
            </section>
          )}

          {activeTab === 'postEvent' && (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 40, flex: 1, width: '100%' }}>
              {/* Post Event Section */}
              <section className="section" style={{ width: 350, minWidth: 280, flex: '1 1 350px', maxWidth: 400, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflowY: 'auto', minHeight: 0 }}>
                <EventForm onEventPosted={fetchEvents} />
              </section>
              {/* All Events Section */}
              <section className="section alumni-tweets-scrollable" style={{ width: 600, minWidth: 300, flex: '2 1 600px', maxWidth: 700, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 24, flex: '0 0 auto' }}>All Events</h2>
                <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
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
          )}

          {activeTab === 'postJob' && (
            <section className="section" style={{ width: '100%' }}>
              <Postjob />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainAdminPanel;
