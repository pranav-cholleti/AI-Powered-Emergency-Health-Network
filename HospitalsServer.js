const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

const url = 'mongodb://localhost:27017/';  // MongoDB connection string
const dbName = 'MedReady';  // Database name

let db;
let hospitalCollection;

// Enable CORS for all routes (important for cross-origin requests from React)
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(url)
  .then(client => {
    db = client.db(dbName);
    hospitalCollection = db.collection('Hospitals');
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit the process if DB connection fails
  });

// Fetch hospitals data
// Fetch hospitals data with description
// Fetch hospitals data with detailed description, tests_available, specialties, and facilities
app.get('/api/hospitals', async (req, res) => {
  try {
    // Fetch all hospitals from the 'Hospitals' collection
    const hospitals = await hospitalCollection.find().toArray();

    // Extract relevant fields: username, location, description, tests_available, specialties, and facilities
    const hospitalData = hospitals.map(hospital => ({
      username: hospital.username,
      location: hospital.location || 'No Location',
      description: hospital.description || 'No Description Available',
      tests_available: hospital.tests_available || ['No tests available'],
      specialties: Array.isArray(hospital.specialties) ? hospital.specialties : [hospital.specialties || 'No specialties available'],
      facilities: Array.isArray(hospital.facilities) ? hospital.facilities : [hospital.facilities || 'No facilities available'],
    }));
    
    res.json(hospitalData);  // Send the filtered data as JSON response
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return res.status(500).json({ message: 'Error fetching hospitals data' });
  }
});

// Route to serve static files (e.g., for hospital detail pages if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Hospital Server is running on http://localhost:${port}`);
});
