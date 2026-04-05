import React from 'react';
import { useChatContext } from '../../contexts/ChatContext';

const ChatList = () => {
  const { 
    connections, 
    activeChat, 
    setActiveChatAndLoadMessages
  } = useChatContext();

  const getOtherPartyName = (connection) => {
    return connection.name || 'Chat';
  };
  
  const handleChatSelect = (connection) => {
    setActiveChatAndLoadMessages(connection);
  };

  return (
    <div className="chat-list">
      {!connections || connections.length === 0 ? (
        <div className="no-chats">
          <p>No active chats</p>
          <p className="hint">You can start a chat with alumni from the Directory page</p>
        </div>
      ) : (
        connections.map(connection => (
          <div 
            key={connection.id} 
            className={`chat-item ${activeChat?.id === connection.id ? 'active' : ''}`}
            onClick={() => handleChatSelect(connection)}
          >
            <div className="chat-avatar">
              {getOtherPartyName(connection).charAt(0)}
            </div>
            <div className="chat-info">
              <div className="chat-name">{getOtherPartyName(connection)}</div>
              <div className="chat-preview">
                {connection.last_message ? (
                  <span>{connection.last_message.substring(0, 30)}{connection.last_message.length > 30 ? '...' : ''}</span>
                ) : (
                  <span className="no-messages">No messages yet</span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;