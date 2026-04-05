import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    if (currentUser) {
      const newSocket = io('http://localhost:5000', {
        query: {
          userId: currentUser.id
        }
      });
      setSocket(newSocket);
      
      // Socket event listeners
      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        fetchConnections();
        fetchPendingRequests();
      });
      
      newSocket.on('online_users', (users) => {
        setOnlineUsers(users);
      });

      // Clean up on unmount
      return () => newSocket.disconnect();
    }
  }, [currentUser]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for incoming chat requests
    socket.on('chat_request', (data) => {
      // Add to pending requests
      setPendingRequests(prev => [...prev, data]);
    });

    // Listen for chat request acceptance
    socket.on('chat_request_accepted', (data) => {
      // Add to connections
      fetchConnections();
    });

    // Listen for private messages
    socket.on('private_message', (data) => {
      if (activeChat && 
          (activeChat.id === data.sender_id || activeChat.id === data.recipient_id)) {
        setMessages(prev => [...prev, data]);
      }
      
      // Update the connection with the latest message
      setConnections(prev => {
        return prev.map(conn => {
          if ((conn.user_id === data.sender_id && conn.connection_id === data.recipient_id) || 
              (conn.user_id === data.recipient_id && conn.connection_id === data.sender_id)) {
            return { ...conn, last_message: data.message, last_message_time: data.timestamp };
          }
          return conn;
        });
      });
    });

    return () => {
      socket.off('chat_request');
      socket.off('chat_request_accepted');
      socket.off('private_message');
    };
  }, [socket, activeChat]);

  // Fetch user's chat connections
  const fetchConnections = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/chat/connections/${currentUser.id}`);
      const data = await response.json();
      setConnections(data);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  // Fetch pending chat requests
  const fetchPendingRequests = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/chat/requests/${currentUser.id}`);
      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  // Fetch messages for active chat
  const fetchMessages = async (connectionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/messages/${connectionId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a chat request
  const sendChatRequest = async (receiverId) => {
    if (!currentUser || !socket) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/chat/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: currentUser.id, receiverId })
      });
      
      if (response.ok) {
        socket.emit('send_chat_request', {
          senderId: currentUser.id,
          senderName: currentUser.name,
          receiverId
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending chat request:', error);
      return false;
    }
  };

  // Accept a chat request
  const acceptChatRequest = async (requestId, senderId, senderName) => {
    if (!currentUser || !socket) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/chat/request/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' })
      });
      
      if (response.ok) {
        socket.emit('accept_chat_request', {
          senderId,
          receiverId: currentUser.id,
          receiverName: currentUser.name
        });
        
        // Remove from pending requests
        setPendingRequests(prev => prev.filter(req => req.id !== requestId));
        
        // Refresh connections
        fetchConnections();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error accepting chat request:', error);
      return false;
    }
  };

  // Reject a chat request
  const rejectChatRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/request/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      
      if (response.ok) {
        // Remove from pending requests
        setPendingRequests(prev => prev.filter(req => req.id !== requestId));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error rejecting chat request:', error);
      return false;
    }
  };

  // Send a message
  const sendMessage = async (message) => {
    if (!currentUser || !socket || !activeChat) return;
    
    try {
      const messageData = {
        connectionId: activeChat.id,
        senderId: currentUser.id,
        message
      };
      
      const response = await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      
      if (response.ok) {
        const receiverId = activeChat.sender_id === currentUser.id ? 
          activeChat.receiver_id : activeChat.sender_id;
        
        socket.emit('send_private_message', {
          senderId: currentUser.id,
          senderName: currentUser.name,
          receiverId,
          message
        });
        
        // Add message to local state
        const newMessage = {
          sender_id: currentUser.id,
          sender_name: currentUser.name,
          message,
          created_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, newMessage]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  // Set current user and load data
  const initializeChat = (user) => {
    setCurrentUser(user);
  };

  // Set active chat and load messages
  const setActiveChatAndLoadMessages = (connection) => {
    setActiveChat(connection);
    if (connection) {
      fetchMessages(connection.id);
      
      // Mark messages as read
      markMessagesAsRead(connection.id);
    } else {
      setMessages([]);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (connectionId) => {
    if (!currentUser) return;
    
    try {
      await fetch('http://localhost:5000/api/chat/messages/read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionId, userId: currentUser.id })
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Load initial data when user is set
  useEffect(() => {
    if (currentUser) {
      fetchConnections();
      fetchPendingRequests();
    }
  }, [currentUser]);

  const value = {
    socket,
    connections,
    pendingRequests,
    activeChat,
    messages,
    onlineUsers,
    currentUser,
    initializeChat,
    sendChatRequest,
    acceptChatRequest,
    rejectChatRequest,
    sendMessage,
    setActiveChatAndLoadMessages,
    fetchConnections,
    fetchPendingRequests
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};