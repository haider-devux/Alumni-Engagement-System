import React, { useState } from 'react';
import { useChatContext } from '../../contexts/ChatContext';

const DirectoryChat = ({ recipientId, recipientName }) => {
  const { sendChatRequest } = useChatContext();
  const [requestSent, setRequestSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendRequest = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setError('You must be logged in to send chat requests');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await sendChatRequest(recipientId);
      
      if (result) {
        setRequestSent(true);
      } else {
        setError('Failed to send chat request');
      }
    } catch (err) {
      setError('Error sending chat request');
      console.error('Chat request error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show chat button for current user
  const user = localStorage.getItem('user');
  if (user && JSON.parse(user).id === recipientId) {
    return null;
  }

  return (
    <div>
      <button 
        className={`directory-chat-button ${requestSent ? 'sent' : ''}`}
        onClick={handleSendRequest}
        disabled={isLoading || requestSent}
        style={{
          backgroundColor: requestSent ? '#4CAF50' : '#3498db',
          color: 'white',
          padding: '8px 12px',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading || requestSent ? 'default' : 'pointer',
          width: '100%',
          fontSize: '0.9rem'
        }}
      >
        {isLoading ? 'Sending...' : requestSent ? 'Request Sent' : 'Chat'}
      </button>
      
      {error && (
        <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default DirectoryChat;