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
    res.render('index');
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
  
      // Insert data into sensor_status table
    //   const sensorStatusQuery = 'INSERT INTO sensor_status (sensorID, status, updated_at) VALUES (?, ?, ?)';
    //   connection.query(sensorStatusQuery, [sensorID, status, new Date()], (err, results) => {
    //     if (err) {
    //       console.error('Error inserting sensor status:', err);
    //       return res.status(500).send('Error inserting sensor status');
    //     }
  
    //     res.status(200).send('Sensor data and status inserted successfully');
    //   });
    });
  });

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});