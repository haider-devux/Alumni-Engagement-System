# Alumni Engagement System - Chat Feature Documentation

## Overview

The chat feature enables alumni to connect with each other through real-time messaging. Alumni can send chat requests to other alumni from the directory, accept or reject incoming requests, and exchange messages in real-time.

## Technical Implementation

### Backend Components

#### Database Schema

The chat functionality is supported by two main database tables:

1. **chat_connection_requests**
   - Tracks connection requests between alumni
   - Stores sender_id, receiver_id, and status (pending, accepted, rejected)
   - Includes timestamps for creation and updates

2. **chat_messages**
   - Stores messages exchanged between connected alumni
   - References connection_id to link messages to a specific connection
   - Tracks sender_id, message content, read status, and timestamp

#### API Endpoints

The following REST API endpoints support the chat functionality:

- `GET /api/chat/connections/:userId` - Get all active chat connections for a user
- `GET /api/chat/requests/:userId` - Get pending chat requests for a user
- `POST /api/chat/request` - Send a new chat request
- `PUT /api/chat/request/:requestId` - Accept or reject a chat request
- `GET /api/chat/messages/:connectionId` - Get chat messages for a connection
- `POST /api/chat/message` - Send a chat message
- `PUT /api/chat/messages/read` - Mark messages as read

#### Socket.IO Implementation

Real-time communication is implemented using Socket.IO with the following events:

- `connection` - Handles new socket connections
- `send_chat_request` - Emits a chat request to the recipient
- `accept_chat_request` - Notifies the sender when a request is accepted
- `send_private_message` - Sends a private message to a specific recipient
- `join_room` - Allows users to join a specific chat room
- `disconnect` - Handles user disconnection

### Frontend Components

#### Context Provider

The `ChatContext` provides global state management for the chat functionality:

- Manages connections, pending requests, and active chats
- Handles Socket.IO connection and event listeners
- Provides methods for sending/accepting chat requests and messages

#### UI Components

1. **Chat.js**
   - Main container component for the chat interface
   - Manages tabs for active chats and pending requests
   - Handles minimizing/maximizing the chat window

2. **ChatList.js**
   - Displays a list of active chat connections
   - Shows user names and message previews
   - Allows selecting a chat to view messages

3. **ChatMessages.js**
   - Displays messages for the active chat
   - Provides a form for sending new messages
   - Shows message status (sent/read)
   - Auto-scrolls to the latest message

4. **ChatRequests.js**
   - Shows pending chat requests
   - Provides buttons to accept or reject requests

5. **DirectoryChat.js**
   - Integrated into the alumni directory
   - Allows sending chat requests to other alumni
   - Shows status of sent requests

## User Flow

1. **Initiating a Chat**
   - User navigates to the Alumni Directory
   - User clicks the "Chat" button on an alumni's card
   - A chat request is sent to the selected alumni

2. **Accepting a Chat Request**
   - User receives a notification for a new chat request
   - User navigates to the "Requests" tab in the chat interface
   - User accepts or rejects the request

3. **Messaging**
   - After a connection is established, users can exchange messages
   - Messages are delivered in real-time
   - Users can see when their messages are read

## Security Considerations

- Chat connections require mutual acceptance
- Users can only send messages to connections they have established
- User authentication is verified for all chat operations
- Messages are associated with specific users for accountability

## Future Enhancements

- Group chat functionality
- File sharing capabilities
- Read receipts with timestamps
- Typing indicators
- Message search functionality
- Push notifications for new messages