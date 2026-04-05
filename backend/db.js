require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool(); // uses .env by default
module.exports = pool;