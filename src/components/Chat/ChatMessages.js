import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from '../../contexts/ChatContext';

const ChatMessages = () => {
  const { 
    activeChat, 
    messages, 
    sendMessage, 
    setActiveChatAndLoadMessages
  } = useChatContext();
  
  const [sending, setSending] = useState(false);
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    try {
      const result = await sendMessage(newMessage.trim());
      if (!result) {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
      setNewMessage('');
    }
  };

  const getOtherPartyName = () => {
    if (!activeChat) return '';
    return activeChat.name || 'Chat';
  };

  if (!activeChat) {
    return (
      <div className="chat-messages-container empty">
        <div className="no-chat-selected">
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-messages-container">
      <div className="chat-messages-header">
        <button 
          className="back-button"
          onClick={() => setActiveChatAndLoadMessages(null)}
        >
          &larr;
        </button>
        <div className="chat-recipient">{getOtherPartyName()}</div>
      </div>
      
      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet</p>
            <p className="hint">Send a message to start the conversation</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
            const isSent = user && msg.sender_id === user.id;
            
            return (
              <div 
                key={msg.id || index} 
                className={`message ${isSent ? 'sent' : 'received'}`}
              >
                <div className="message-content">{msg.message}</div>
                <div className="message-time">
                  {new Date(msg.timestamp || msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {msg.read === false && isSent && (
                  <div className="message-status">Sent</div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!newMessage.trim() || sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatMessages;