const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5010; // Port for Donors

const url = 'mongodb://localhost:27017/'; // MongoDB connection string
const dbName = 'MedReady'; // Database name

let db;
let donorsCollection; // For Donors collection

// Enable CORS for all routes (important for cross-origin requests from React)
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(url)
  .then((client) => {
    db = client.db(dbName);
    donorsCollection = db.collection('Donors'); // Donors collection
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if DB connection fails
  });

// Fetch donors data
app.get('/api/donors', async (req, res) => {
  try {
    const donors = await donorsCollection.find().toArray();
    const donorData = donors.map((donor) => ({
      username: donor.username,
      donation: donor.donation || 'Not Available',
      email: donor.email || 'Not Available',
      location: donor.location || 'Not Available', // Include location field
    }));

    res.json(donorData);
  } catch (error) {
    console.error('Error fetching donors:', error);
    return res.status(500).json({ message: 'Error fetching donors data' });
  }
});

// Delete a donor by username
app.delete('/api/donors/:username', async (req, res) => {
  try {
    const donorUsername = req.params.username;
    console.log(`Deleting donor with username: ${donorUsername}`);

    const result = await donorsCollection.deleteOne({ username: donorUsername });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Donor deleted successfully' });
    } else {
      res.status(404).json({ message: 'Donor not found' });
    }
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Add a new donor
app.post('/api/donors', async (req, res) => {
  try {
    const { username, donation, email, location } = req.body;

    if (!username || !email || !location) {
      return res.status(400).json({ message: 'Username, email, and location are required' });
    }

    const donor = {
      username,
      donation: donation || 'Not Available',
      email,
      location,
    };

    await donorsCollection.insertOne(donor);

    res.status(201).json({ message: 'Donor added successfully' });
  } catch (error) {
    console.error('Error adding donor:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Route to serve static files (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Donor Server is running on http://localhost:${port}`);
});
