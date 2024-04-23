const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
  queueLimit: 0,
};

// Get JWT secret key from environment variables
const jwtSecret = process.env.JWT_SECRET;

// Create a MySQL pool with promise support
const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to database');
    connection.release();
  }
});

module.exports = pool;
