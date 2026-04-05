const pool = require('./db');

async function setupChatTables() {
  try {
    console.log('Setting up chat tables...');
    
    // Create chat_connection_requests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_connection_requests (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES registered_alumni(id) ON DELETE CASCADE,
        receiver_id INTEGER REFERENCES registered_alumni(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(sender_id, receiver_id)
      )
    `);
    
    // Create chat_messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        connection_id INTEGER REFERENCES chat_connection_requests(id) ON DELETE CASCADE,
        sender_id INTEGER REFERENCES registered_alumni(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_chat_connection_sender ON chat_connection_requests(sender_id)
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_chat_connection_receiver ON chat_connection_requests(receiver_id)
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_chat_messages_connection ON chat_messages(connection_id)
    `);
    
    console.log('Chat tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up chat tables:', error);
    process.exit(1);
  }
}

setupChatTables();
