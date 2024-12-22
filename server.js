const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(cors());
app.use(express.json());

// Set up the MySQL connection using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,        // e.g., sql12.freesqldatabase.com
  user: process.env.DB_USER,        // e.g., sql12753382
  password: process.env.DB_PASSWORD, // e.g., nTdwZdy6Vz
  database: process.env.DB_NAME,     // e.g., sql12753382
  port: process.env.DB_PORT,         // e.g., 3306
});


connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the MySQL database!');
  });


connection.query(
  `CREATE TABLE IF NOT EXISTS USERDATA (
    id INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(255),
    NUMBER VARCHAR(15),
    AGE INT
  )`,
  (err) => {
    if (err) throw err;
    console.log('USERDATA table ready');
  }
);

app.post('/api/add-user', (req, res) => {
  const { name, number, age } = req.body;
  const query = 'INSERT INTO USERDATA (NAME, NUMBER, AGE) VALUES (?, ?, ?)';
  db.query(query, [name, number, age], (err) => {
    if (err) throw err;
    res.status(201).json({ message: 'User added successfully' });
  });
});

app.get('/api/users', (req, res) => {
  console.log("inside the request");
  const query = 'SELECT * FROM USERDATA';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});