const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5004;

const url = 'mongodb://localhost:27017/';  // MongoDB connection string
const dbName = 'MedReady';  // Database name

let db;
let hospitalCollection;

app.use(cors());
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
    process.exit(1);
  });

// Fetch hospital data by username
app.get('/api/hospital/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const hospital = await hospitalCollection.findOne({ username });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (error) {
    console.error('Error fetching hospital:', error);
    res.status(500).json({ message: 'Error fetching hospital data' });
  }
});

// Fetch all hospitals data
app.get('/api/hospitals', async (req, res) => {
  try {
    const hospitals = await hospitalCollection.find().toArray();

    const hospitalData = hospitals.map(hospital => ({
      username: hospital.username,
      location: hospital.location || 'No Location',
      description: hospital.description || 'No Description Available',
      tests_available: hospital.tests_available || ['No tests available'],
      specialties: Array.isArray(hospital.specialties) ? hospital.specialties : [hospital.specialties || 'No specialties available'],
      facilities: Array.isArray(hospital.facilities) ? hospital.facilities : [hospital.facilities || 'No facilities available'],
    }));

    res.json(hospitalData);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return res.status(500).json({ message: 'Error fetching hospitals data' });
  }
});

// Update hospital data
app.put('/api/hospital/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { location, description, tests_available, specialties, facilities } = req.body;

    // Validate the received data
    if (!location || !description || !tests_available || !specialties || !facilities) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedData = {
      location,
      description,
      tests_available,
      specialties,
      facilities
    };

    // Update the hospital data in the database
    const result = await hospitalCollection.updateOne(
      { username },
      { $set: updatedData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Hospital not found or no changes made' });
    }

    const updatedHospital = await hospitalCollection.findOne({ username });
    res.json(updatedHospital);
  } catch (error) {
    console.error('Error updating hospital data:', error);
    res.status(500).json({ message: 'Error updating hospital data' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Hospital Server is running on http://localhost:${port}`);
});
