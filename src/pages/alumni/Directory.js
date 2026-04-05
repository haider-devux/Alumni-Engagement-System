import React, { useState, useEffect } from 'react';
import AlumniNavbar from '../../components/AlumniNavbar';
import SubAdminNavbar from '../../components/SubAdminNavbar';
import DirectoryChat from '../../components/Chat/DirectoryChat';
import { useChatContext } from '../../contexts/ChatContext';

const Directory = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { initializeChat } = useChatContext();
  
  // Check user type to determine which navbar to show
  const isSubAdmin = !!localStorage.getItem('subadmin');
  const isAlumni = !!localStorage.getItem('user');
  const currentUser = isAlumni ? JSON.parse(localStorage.getItem('user')) : null;

  // Initialize chat with current user
  useEffect(() => {
    if (currentUser) {
      initializeChat(currentUser);
    }
  }, [currentUser, initializeChat]);

  // Fetch alumni from backend
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/registered_alumni');
        const data = await response.json();
        if (response.ok) {
          setAlumni(data);
        } else {
          setError('Failed to fetch alumni directory');
        }
      } catch (err) {
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // Filter alumni based on search term
  const filteredAlumni = alumni.filter(person => 
    person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.batch_year?.toString().includes(searchTerm) ||
    person.faculty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.degree?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.roll_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      {isSubAdmin ? <SubAdminNavbar /> : isAlumni ? <AlumniNavbar /> : <AlumniNavbar />}
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '40px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Alumni Directory</h2>
        
        {/* Search Bar */}
        <div style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
          <input
            type="text"
            placeholder="Search alumni by name, email, batch year, faculty, degree, or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading alumni directory...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>
            <p>{error}</p>
          </div>
        ) : filteredAlumni.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No alumni found matching your search.</p>
          </div>
        ) : (
          <div className="alumni-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {filteredAlumni.map((person) => (
              <div key={person.id} className="alumni-card" style={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: '#2c3e50',
                    fontSize: '1.25rem',
                    fontWeight: '600'
                  }}>
                    {person.name}
                  </h3>
                  <p style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: '#7f8c8d',
                    fontSize: '0.9rem'
                  }}>
                    {person.email}
                  </p>
                </div>
                
                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                  {person.batch_year && (
                    <p style={{ margin: '0.25rem 0' }}>
                      <strong>Batch:</strong> {person.batch_year}
                    </p>
                  )}
                  {person.faculty && (
                    <p style={{ margin: '0.25rem 0' }}>
                      <strong>Faculty:</strong> {person.faculty}
                    </p>
                  )}
                  {person.degree && (
                    <p style={{ margin: '0.25rem 0' }}>
                      <strong>Degree:</strong> {person.degree}
                    </p>
                  )}
                  {person.roll_number && (
                    <p style={{ margin: '0.25rem 0' }}>
                      <strong>Roll Number:</strong> {person.roll_number}
                    </p>
                  )}
                  
                  {/* Only show chat button for alumni users and not for their own profile */}
                  {isAlumni && localStorage.getItem('user') && 
                   JSON.parse(localStorage.getItem('user')).id !== person.id && (
                    <div style={{ marginTop: '1rem' }}>
                      <DirectoryChat recipientId={person.id} recipientName={person.name} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Directory;
