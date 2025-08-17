// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Example: "postgres://user:pass@localhost:5432/africa_auth"
  // For production with SSL (e.g., on Heroku):
  // ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database.');
});

module.exports = pool;
