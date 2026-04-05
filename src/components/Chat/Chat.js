import React, { useState, useEffect } from 'react';
import { useChatContext } from '../../contexts/ChatContext';
import ChatList from './ChatList';
import ChatMessages from './ChatMessages';
import ChatRequests from './ChatRequests';
import './Chat.css';

const Chat = () => {
  const { 
    connections,
    pendingRequests,
    fetchConnections,
    fetchPendingRequests
  } = useChatContext();
  
  // User authentication check
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const [activeTab, setActiveTab] = useState('chats');

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    setIsAuthenticated(!!userStr);
  }, []);

  // Refresh data periodically
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Initial fetch
    fetchConnections();
    fetchPendingRequests();
    
    const interval = setInterval(() => {
      fetchConnections();
      fetchPendingRequests();
    }, 30000); // every 30 seconds
    
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchConnections, fetchPendingRequests]);

  if (!isAuthenticated) {
    return null; // Don't render if not logged in
  }

  return (
    <div className={`chat-container ${minimized ? 'minimized' : ''}`}>
      <div className="chat-header">
        <div className="chat-title">Alumni Chat</div>
        <div className="chat-tabs">
          <button 
            className={`chat-tab ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            Chats {connections.length > 0 && <span className="badge">{connections.length}</span>}
          </button>
          <button 
            className={`chat-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Requests {pendingRequests.length > 0 && <span className="badge">{pendingRequests.length}</span>}
          </button>
        </div>
        <button 
          className="minimize-button"
          onClick={() => setMinimized(!minimized)}
        >
          {minimized ? '▲' : '▼'}
        </button>
      </div>
      
      {!minimized && (
        <div className="chat-body">
          {activeTab === 'chats' ? (
            <ChatList />
          ) : (
            <ChatRequests />
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;