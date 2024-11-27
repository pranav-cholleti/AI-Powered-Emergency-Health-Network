const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5006;

const url = 'mongodb://localhost:27017/'; // MongoDB connection string
const dbName = 'MedReady'; // Database name

let db;
let patientsCollection;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    patientsCollection = db.collection('Patients');
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Get patient profile by username
app.get('/api/patient/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const patient = await patientsCollection.findOne({ username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      report: patient.report || {},
      donation: patient.donation || '',
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Error fetching patient data' });
  }
});

// Update patient profile
app.put('/api/patient/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { report, donation } = req.body;

    if (!report && donation === undefined) {
      return res.status(400).json({ message: 'At least one of report or donation data is required' });
    }

    const updateFields = {};
    if (report) {
      updateFields.report = {
        blood_group: report.blood_group,
        weight: report.weight,
        age: report.age,
        address: report.address,
        phone: report.phone,
        email: report.email,
        medical_conditions: report.medical_conditions,
      };
    }

    if (donation !== undefined) {
      updateFields.donation = donation;
    }

    const result = await patientsCollection.updateOne(
      { username },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Patient not found or no changes made' });
    }

    res.json(await patientsCollection.findOne({ username }));
  } catch (error) {
    console.error('Error updating patient data:', error);
    res.status(500).json({ message: 'Error updating patient data' });
  }
});

// Remove the donation status
app.delete('/api/patient/:username/donation', async (req, res) => {
  try {
    const { username } = req.params;

    const result = await patientsCollection.updateOne(
      { username },
      { $unset: { donation: '' } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Patient not found or no changes made' });
    }

    res.json({ message: 'Donation status removed successfully' });
  } catch (error) {
    console.error('Error removing donation status:', error);
    res.status(500).json({ message: 'Error removing donation status' });
  }
});

// Serve static files if necessary
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Patient Server is running on http://localhost:${port}`);
});
