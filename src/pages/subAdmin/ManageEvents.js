import React, { useState } from 'react';
import SubAdminNavbar from '../../components/SubAdminNavbar';

const SubAdminEventsPanel = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    attendees: null,
  });

  const handleInputChange = (e) => {
    setNewEvent(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const id = Date.now(); // Simple unique ID
    setEvents([...events, { ...newEvent, id }]);
    setNewEvent({ title: '', date: '', location: '', description: '', attendees: null });
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <>
      <SubAdminNavbar />
      <div className="request-form container">
        <h2>📅 Manage Events</h2>

        <div>
          <form className="request-form-container" onSubmit={handleAddEvent}>
            <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} placeholder="Event Title" required />
            <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} required />
            <input type="text" name="location" value={newEvent.location} onChange={handleInputChange} placeholder="Location" required />
            <textarea name="description" value={newEvent.description} onChange={handleInputChange} placeholder="Event Description" rows="3" required />
            <button type="submit" className="submit-btn">Add Event</button>
          </form>
        </div>

        <div className="event-list-container">
          <h3>Existing Events</h3>
          {events.length === 0 ? <p>No events added yet.</p> : (
            events.map(event => (
              <div key={event.id} className="event-list-table">
                <h4>{event.title}</h4>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p>{event.description}</p>
                <p><strong>Attendees:</strong> {event.attendees ?? 'N/A'}</p>
                <button className="event-delete-btn" onClick={() => handleDeleteEvent(event.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default SubAdminEventsPanel;


