const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all chat connections for a user
router.get('/connections/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const connections = await pool.query(
      `SELECT cr.*, 
        sender.name as sender_name, sender.email as sender_email,
        receiver.name as receiver_name, receiver.email as receiver_email
      FROM chat_connection_requests cr
      JOIN registered_alumni sender ON cr.sender_id = sender.id
      JOIN registered_alumni receiver ON cr.receiver_id = receiver.id
      WHERE (cr.sender_id = $1 OR cr.receiver_id = $1) AND cr.status = 'accepted'
      ORDER BY cr.updated_at DESC`,
      [userId]
    );
    
    res.json(connections.rows);
  } catch (error) {
    console.error('Error fetching chat connections:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get pending chat requests for a user
router.get('/requests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const requests = await pool.query(
      `SELECT cr.*, 
        sender.name as sender_name, sender.email as sender_email
      FROM chat_connection_requests cr
      JOIN registered_alumni sender ON cr.sender_id = sender.id
      WHERE cr.receiver_id = $1 AND cr.status = 'pending'
      ORDER BY cr.created_at DESC`,
      [userId]
    );
    
    res.json(requests.rows);
  } catch (error) {
    console.error('Error fetching chat requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send a chat request
router.post('/request', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    
    // Check if request already exists
    const existingRequest = await pool.query(
      'SELECT * FROM chat_connection_requests WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)',
      [senderId, receiverId]
    );
    
    if (existingRequest.rows.length > 0) {
      return res.status(400).json({ error: 'Chat request already exists' });
    }
    
    const result = await pool.query(
      'INSERT INTO chat_connection_requests (sender_id, receiver_id) VALUES ($1, $2) RETURNING *',
      [senderId, receiverId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error sending chat request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept or reject a chat request
router.put('/request/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    
    if (status !== 'accepted' && status !== 'rejected') {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = await pool.query(
      'UPDATE chat_connection_requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, requestId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chat request not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating chat request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get chat messages for a connection
router.get('/messages/:connectionId', async (req, res) => {
  try {
    const { connectionId } = req.params;
    
    const messages = await pool.query(
      `SELECT cm.*, ra.name as sender_name
      FROM chat_messages cm
      JOIN registered_alumni ra ON cm.sender_id = ra.id
      WHERE cm.connection_id = $1
      ORDER BY cm.created_at ASC`,
      [connectionId]
    );
    
    res.json(messages.rows);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send a chat message
router.post('/message', async (req, res) => {
  try {
    const { connectionId, senderId, message } = req.body;
    
    // Verify the connection exists and user is part of it
    const connection = await pool.query(
      'SELECT * FROM chat_connection_requests WHERE id = $1 AND (sender_id = $2 OR receiver_id = $2) AND status = \'accepted\'',
      [connectionId, senderId]
    );
    
    if (connection.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to send message to this connection' });
    }
    
    const result = await pool.query(
      'INSERT INTO chat_messages (connection_id, sender_id, message) VALUES ($1, $2, $3) RETURNING *',
      [connectionId, senderId, message]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error sending chat message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark messages as read
router.put('/messages/read', async (req, res) => {
  try {
    const { connectionId, userId } = req.body;
    
    await pool.query(
      `UPDATE chat_messages 
      SET read = TRUE 
      WHERE connection_id = $1 AND sender_id != $2 AND read = FALSE`,
      [connectionId, userId]
    );
    
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;