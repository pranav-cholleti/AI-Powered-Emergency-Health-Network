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
let patientCollection;

// Enable CORS for all routes (important for cross-origin requests from React)
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(url)
  .then(client => {
    db = client.db(dbName);
    hospitalCollection = db.collection('Hospitals');
    patientCollection = db.collection('Patients');
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit the process if DB connection fails
  });

// Fetch hospitals data
// Fetch hospitals data (all hospitals should be displayed)
// Fetch all hospitals (all hospitals should be displayed)
app.get('/api/hospitals', async (req, res) => {
  try {
    // Fetch all hospitals without filtering by location
    const allHospitals = await hospitalCollection.find({}).toArray();

    const allHospitalData = allHospitals.map(hospital => ({
      username: hospital.username,
      location: hospital.location || 'No Location',
      description: hospital.description || 'No Description Available',
      tests_available: hospital.tests_available || ['No tests available'],
      specialties: Array.isArray(hospital.specialties) ? hospital.specialties : [hospital.specialties || 'No specialties available'],
      facilities: Array.isArray(hospital.facilities) ? hospital.facilities : [hospital.facilities || 'No facilities available'],
    }));

    res.json(allHospitalData); // Send the full list of hospitals as a JSON response
  } catch (error) {
    console.error('Error fetching all hospitals:', error);
    return res.status(500).json({ message: 'Error fetching hospitals data' });
  }
});

// Fetch recommended hospitals based on role and username
app.get('/api/recommended-hospitals', async (req, res) => {try {
  const { role, username } = req.query; // Get role and username from query params
  let filter = {};
  let location = '';

  // Check if the role is 'patient'
  if (role === 'patient') {
    const patient = await db.collection('Patients').findOne({ username });
    if (patient) {
      location = patient.report?.address || '';
    }
  }

  // Check if the role is 'hospital'
  if (role === 'hospital') {
    const hospital = await hospitalCollection.findOne({ username });
    if (hospital) {
      location = hospital.location || '';
    }
  }

  // Now filter hospitals based on location if it exists
  if (location) {
    filter.location = { $regex: location, $options: 'i' }; // case-insensitive partial match
  }

  // Fetch hospitals based on location filter
  const hospitals = await hospitalCollection.find(filter).toArray();

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

// Start the server
app.listen(port, () => {
  console.log(`Hospital Server is running on http://localhost:${port}`);
});
