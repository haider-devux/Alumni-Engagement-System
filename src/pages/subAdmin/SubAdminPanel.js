"use client"

import React, { useState, useEffect } from 'react';
import SubAdminNavbar from '../../components/SubAdminNavbar';
import Postjob from '../alumni/Postjob';
import EventForm from '../../components/EventForm';
import '../../styles/main.css';

const SubAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('postEvent');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Directory state
  const [alumni, setAlumni] = useState([]);
  const [dirLoading, setDirLoading] = useState(false);
  const [dirError, setDirError] = useState('');

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
      const alumniRes = await fetch('http://localhost:5000/api/registered_alumni');
      const alumniData = await alumniRes.json();
      setAlumni(alumniData);
    } catch (err) {
      setDirError('Failed to fetch alumni');
    }
    setDirLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'directory') fetchDirectory();
    if (activeTab === 'postEvent') fetchEvents();
  }, [activeTab]);

  return (
    <div className="home-container" style={{ minHeight: '100vh', background: 'var(--oxford-light)' }}>
      <SubAdminNavbar />
      <div style={{ marginTop: 90, padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 24 }}>Sub-Admin Dashboard</h1>
        {/* Tab Navigation */}
        <div className="admin-tabs">
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
            <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40, justifyContent: 'center', alignItems: 'flex-start' }}>
              {/* Alumni List */}
              <section className="section" style={{ width: '100%' }}>
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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 40, flex: 1, width: '100%' }}>
              <section className="section" style={{ width: '100%', maxWidth: 900 }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 16, textAlign: 'center' }}>Post a Job</h2>
                <Postjob />
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubAdminPanel;

