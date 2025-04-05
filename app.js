const dotenv = require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();

// Use EJS for rendering
app.set('view engine', 'ejs');
// Add this middleware to handle JSON requests
app.use(express.json());

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

// Route to render the index page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Route to fetch sensor data as JSON
app.get('/get-sensor-data', (req, res) => {
  connection.query('SELECT * FROM sensor_data ORDER BY recorded_at DESC LIMIT 20', (err, results) => {
    if (err) {
      console.error('Error fetching sensor data:', err);
      return res.status(500).send('Error fetching data');
    }
    res.status(200).json(results);
  });
});

app.post('/add-sensor-data', (req, res) => {
  const { temperature, humidity, sensorID, status } = req.body;

  const gas = 0;
  const recorded_at = new Date();

  // Insert data into sensor_data table
  const sensorDataQuery = 'INSERT INTO sensor_data (temperature, humidity, gas, recorded_at) VALUES (?, ?, ?, ?)';
  connection.query(sensorDataQuery, [temperature, humidity, gas, recorded_at], (err, results) => {
    if (err) {
      console.error('Error inserting sensor data:', err);
      return res.status(500).send('Error inserting sensor data');
    }

    // Log the query results
    console.log('Sensor data inserted:', results);

    // Return the query results in the response
    res.status(200).json({
      message: 'Sensor data inserted successfully!',
      queryResults: results
    });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});