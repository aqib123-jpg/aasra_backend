const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(express.json());

// Set up the MySQL connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,        // e.g., sql12.freesqldatabase.com
  user: process.env.DB_USER,        // e.g., sql12753382
  password: process.env.DB_PASSWORD, // e.g., nTdwZdy6Vz
  database: process.env.DB_NAME,     // e.g., sql12753382
  port: process.env.DB_PORT,         // e.g., 3306
  waitForConnections: true,
  connectionLimit: 10,              // Max number of connections
  queueLimit: 0                     // No limit on connection queue
});

// Test the connection when the server starts
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database!');
  connection.release(); // Release the connection after checking
});

// Create the USERDATA table if it doesn't exist
pool.query(
  `CREATE TABLE IF NOT EXISTS USERDATA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(255),
    NUMBER VARCHAR(15),
    AGE INT
  )`,
  (err) => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
    console.log('USERDATA table ready');
  }
);

// API to add user
app.post('/api/add-user', (req, res) => {
  const { name, number, age } = req.body;
  const query = 'INSERT INTO USERDATA (NAME, NUMBER, AGE) VALUES (?, ?, ?)';
  
  pool.query(query, [name, number, age], (err) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Error adding user' });
    }
    res.status(201).json({ message: 'User added successfully' });
  });
});

// API to get all users
app.get('/api/users', (req, res) => {
  console.log("inside the request");
  const query = 'SELECT * FROM USERDATA';
  
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Error fetching users' });
    }
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
