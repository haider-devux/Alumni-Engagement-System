import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlumniNavbar from '../../components/AlumniNavbar';
import Navbar from '../../components/Navbar';
import Chat from '../../components/Chat/Chat';
import { ChatProvider, useChatContext } from '../../contexts/ChatContext';

const DashboardContent = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { initializeChat } = useChatContext();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Initialize chat with current user
  useEffect(() => {
    if (user) {
      initializeChat(user);
    }
  }, [user, initializeChat]);

  // Events state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
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
    fetchEvents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Don't render anything if user is not logged in (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="home-container">
      <AlumniNavbar />
      {/* Dashboard Header */}
      <header className="hero">
        <div className="hero-container" style={{ textAlign: 'left' }}>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: 10 }}>
            Welcome{user ? `, ${user.name}` : ''}!
          </h1>
          <div style={{ display: 'flex', gap: 50, marginTop: 60 , position: 'center'}}>
            <Link to="/profile" className="btn btn-secondary">Update Profile</Link>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Dashboard Main Options */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Alumni Dashboard</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Post a Job</h3>
              <p>Share job opportunities with the ITU alumni network.</p>
              <Link to="/postjob" className="feature-link">Post a Job →</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🐦</div>
              <h3>Post a Tweet</h3>
              <p>Share updates, news, or achievements with your alumni community.</p>
              <Link to="/Posts_Tweets" className="feature-link">Post a Tweet →</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>View Events</h3>
              <p>See upcoming and past alumni events and reunions.</p>
              <Link to="/events" className="feature-link">View Events →</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎉</div>
              <h3>Post Events</h3>
              <p>Create and share alumni events, reunions, and meetups.</p>
              <Link to="/post-events" className="feature-link">Post Events →</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧑‍💼</div>
              <h3>Job Board</h3>
              <p>Browse and apply to jobs posted by fellow alumni.</p>
              <Link to="/jobs" className="feature-link">Browse Jobs →</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Alumni Directory</h3>
              <p>Connect and chat with fellow alumni from your network.</p>
              <Link to="/directory" className="feature-link">Browse Directory →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="dashboard-events-section" style={{ margin: '40px auto', maxWidth: 900 }}>
        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 24 }}>All Events</h2>
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
      </section>

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
                <li><Link to="/directory">Alumni Directory</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/jobs">Job Board</Link></li>
                <li><Link to="/admin-panel">Admin</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Account</h4>
              <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><Link to="/help">Help Center</Link></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Alumni Engagement System. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Chat Component */}
      <Chat />
    </div>
  );
};

const Dashboard = () => {
  return (
    <ChatProvider>
      <DashboardContent />
    </ChatProvider>
  );
};

export default Dashboard; 