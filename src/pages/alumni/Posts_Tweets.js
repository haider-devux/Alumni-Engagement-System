import React, { useEffect, useState } from 'react';
import AlumniNavbar from '../../components/AlumniNavbar';
import '../../styles/main.css';

const Posts_Tweets = () => {
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch all tweets
  const fetchTweets = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/tweets');
      const data = await res.json();
      setTweets(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch tweets');
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!content.trim()) {
      setError('Tweet content cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, content })
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || 'Failed to post tweet');
      } else {
        setSuccess('Tweet posted!');
        setContent('');
        fetchTweets();
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to post tweet');
    }
  };

  return (
    <div className="home-container" style={{ minHeight: '100vh', background: 'var(--oxford-light)', height: '100vh', overflow: 'hidden' }}>
      <AlumniNavbar />
      <div style={{ marginTop: 90, height: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 40,
          flex: 1,
          height: '100%',
          minHeight: 0,
        }}>
          <section className="section" style={{ width: 350, minWidth: 280, flex: '1 1 350px', maxWidth: 400, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 24 }}>Post a Tweet</h2>
            <form onSubmit={handleSubmit} className="login-form" style={{ flex: '0 0 auto' }}>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Share updates, news, or achievements with your alumni community..."
                rows={4}
                className="tweet-textarea"
                required
              />
              {error && <div className="error">{error}</div>}
              {success && <div className="success-msg">{success}</div>}
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? 'Posting...' : 'Post Tweet'}
              </button>
            </form>
          </section>
          <section className="section alumni-tweets-scrollable" style={{ width: 600, minWidth: 300, flex: '2 1 600px', maxWidth: 700, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 24, flex: '0 0 auto' }}>All Alumni Tweets</h2>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              {loading ? (
                <div>Loading tweets...</div>
              ) : (
                <div>
                  {tweets.length === 0 ? (
                    <div>No tweets yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      {tweets.map(tweet => (
                        <div key={tweet.id} className="card tweet-card">
                          <div className="tweet-author">
                            {tweet.name} <span className="tweet-email">({tweet.email})</span>
                          </div>
                          <div className="tweet-content">{tweet.content}</div>
                          <div className="tweet-date">{new Date(tweet.created_at).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Posts_Tweets;
