-- Chat connection requests table
CREATE TABLE chat_connection_requests (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES registered_alumni(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES registered_alumni(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(sender_id, receiver_id)
);

-- Chat messages table
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  connection_id INTEGER REFERENCES chat_connection_requests(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES registered_alumni(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX idx_chat_connection_sender ON chat_connection_requests(sender_id);
CREATE INDEX idx_chat_connection_receiver ON chat_connection_requests(receiver_id);
CREATE INDEX idx_chat_messages_connection ON chat_messages(connection_id);