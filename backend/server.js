const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/chat', chatRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Handle chat request
  socket.on('send_chat_request', (data) => {
    console.log('Chat request:', data);
    io.to(data.receiverId).emit('chat_request', {
      senderId: data.senderId,
      senderName: data.senderName
    });
  });

  // Handle chat request acceptance
  socket.on('accept_chat_request', (data) => {
    console.log('Chat request accepted:', data);
    io.to(data.senderId).emit('chat_request_accepted', {
      receiverId: data.receiverId,
      receiverName: data.receiverName
    });
  });

  // Handle private message
  socket.on('send_private_message', (data) => {
    console.log('Private message:', data);
    io.to(data.receiverId).emit('receive_private_message', {
      senderId: data.senderId,
      senderName: data.senderName,
      message: data.message,
      timestamp: new Date()
    });
  });

  // Handle user joining a room
  socket.on('join_room', (data) => {
    socket.join(data.roomId);
    console.log(`User ${socket.id} joined room: ${data.roomId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));