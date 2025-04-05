const dotenv = require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Use EJS for rendering
app.set('view engine', 'ejs');

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL.');
});

// Route to fetch and display users
app.get('/', (req, res) => {
  connection.query('SELECT * FROM sensor_data order by recorded_at desc', (err, results) => {
    if (err) throw err;
    res.render('index', { sensorData: results });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});