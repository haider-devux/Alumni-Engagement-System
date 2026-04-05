import React, { useState } from 'react';
import { useChatContext } from '../../contexts/ChatContext';

const ChatRequests = () => {
  const { 
    pendingRequests, 
    acceptChatRequest, 
    rejectChatRequest 
  } = useChatContext();
  
  const [processingRequests, setProcessingRequests] = useState({});

  const handleAccept = async (request) => {
    setProcessingRequests(prev => ({ ...prev, [request.id]: 'accepting' }));
    try {
      const result = await acceptChatRequest(request.id, request.sender_id, request.sender_name);
      if (!result) {
        alert('Failed to accept chat request. Please try again.');
      }
    } catch (error) {
      console.error('Error accepting chat request:', error);
      alert('An error occurred while accepting the chat request.');
    } finally {
      setProcessingRequests(prev => ({ ...prev, [request.id]: null }));
    }
  };

  const handleReject = async (request) => {
    setProcessingRequests(prev => ({ ...prev, [request.id]: 'rejecting' }));
    try {
      const result = await rejectChatRequest(request.id);
      if (!result) {
        alert('Failed to reject chat request. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting chat request:', error);
      alert('An error occurred while rejecting the chat request.');
    } finally {
      setProcessingRequests(prev => ({ ...prev, [request.id]: null }));
    }
  };

  return (
    <div className="chat-requests">
      {pendingRequests.length === 0 ? (
        <div className="no-requests">
          <p>No pending chat requests</p>
        </div>
      ) : (
        pendingRequests.map(request => (
          <div key={request.id} className="request-item">
            <div className="request-avatar">
              {request.sender_name.charAt(0)}
            </div>
            <div className="request-info">
              <div className="request-name">{request.sender_name}</div>
              <div className="request-message">
                wants to chat with you
              </div>
            </div>
            <div className="request-actions">
              <button 
                className="accept-button"
                onClick={() => handleAccept(request)}
                disabled={processingRequests[request.id]}
              >
                {processingRequests[request.id] === 'accepting' ? 'Accepting...' : 'Accept'}
              </button>
              <button 
                className="reject-button"
                onClick={() => handleReject(request)}
                disabled={processingRequests[request.id]}
              >
                {processingRequests[request.id] === 'rejecting' ? 'Declining...' : 'Decline'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatRequests;