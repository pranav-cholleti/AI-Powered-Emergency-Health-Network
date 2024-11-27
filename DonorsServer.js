const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 4500; // Port for Donors

const url = 'mongodb://localhost:27017/'; // MongoDB connection string
const dbName = 'MedReady'; // Database name

let db;
let hospitalsCollection; // For Hospitals collection
let patientsCollection; // For Patients collection

// Enable CORS for all routes (important for cross-origin requests from React)
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(url)
  .then(client => {
    db = client.db(dbName);
    hospitalsCollection = db.collection('Hospitals'); // Hospitals collection
    patientsCollection = db.collection('Patients'); // Patients collection
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if DB connection fails
  });

// Fetch donors data from both Hospitals and Patients collections
app.get('/api/donors', async (req, res) => {
  try {
    // Fetch data from Patients collection
    const patients = await patientsCollection.find({ donation: { $exists: true } }).toArray();
    const patientsData = patients.map(patient => ({
      username: patient.username,
      email: patient.report?.email || 'Not Available', // Default email if missing
      location: patient.report?.address || 'Not Available', // Default location if missing
      donation: patient.donation || 'Not Available' // Default donation message if missing
    }));

    // Fetch data from Hospitals collection
    const hospitals = await hospitalsCollection.find({ donation: { $exists: true } }).toArray();
    const hospitalsData = hospitals.map(hospital => ({
      username: hospital.username,
      email: hospital.email || 'Not Available', // Default email if missing
      location: hospital.location || 'Not Available', // Default location if missing
      donation: hospital.donation || 'Not Available' // Default donation message if missing
    }));

    // Combine both data arrays (Patients and Hospitals)
    const allDonors = [...patientsData, ...hospitalsData];

    // Send the combined data as JSON response
    res.json(allDonors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    return res.status(500).json({ message: 'Error fetching donors data' });
  }
});

// Fetch user location based on role and username
app.get('/api/user-location', async (req, res) => {
  const { username, role } = req.query;

  if (!username || !role) {
    return res.status(400).json({ message: 'Username and role are required' });
  }

  try {
    if (role === 'patient') {
      const patient = await patientsCollection.findOne({ username });
      if (patient && patient.report?.address) {
        return res.json({ location: patient.report.address });
      }
    } else if (role === 'hospital') {
      const hospital = await hospitalsCollection.findOne({ username });
      if (hospital && hospital.location) {
        return res.json({ location: hospital.location });
      }
    }

    return res.status(404).json({ message: 'Location not found' });
  } catch (error) {
    console.error('Error fetching user location:', error);
    return res.status(500).json({ message: 'Error fetching user location' });
  }
});

// Fetch user blood group (only for patient)
app.get('/api/user-blood-group', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const patient = await patientsCollection.findOne({ username });
    if (patient && patient.report?.blood_group) {
      return res.json({ blood_group: patient.report.blood_group });
    }

    return res.status(404).json({ message: 'Blood group not found' });
  } catch (error) {
    console.error('Error fetching user blood group:', error);
    return res.status(500).json({ message: 'Error fetching user blood group' });
  }
});

// Route to serve static files (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Donor Server is running on http://localhost:${port}`);
});
