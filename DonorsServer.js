const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 4500;  // Port for Donors

const url = 'mongodb://localhost:27017/';  // MongoDB connection string
const dbName = 'MedReady';  // Database name

let db;
let donorsCollection;  // For Donors collection

// Enable CORS for all routes (important for cross-origin requests from React)
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(url)
  .then(client => {
    db = client.db(dbName);
    donorsCollection = db.collection('Donors');  // Donors collection
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit the process if DB connection fails
  });

// Fetch donors data
app.get('/api/donors', async (req, res) => {
  try {
    // Fetch all donors from the 'Donors' collection
    const donors = await donorsCollection.find().toArray();

    // Extract relevant fields: username, donation, email
    const donorData = donors.map(donor => ({
      username: donor.username,
      donation: donor.donation || 'Not Available',  // Default to 'Not Available' if donation is missing
      email: donor.email || 'Not Available'  // Default email message if missing
    }));

    res.json(donorData);  // Send the filtered data as JSON response
  } catch (error) {
    console.error('Error fetching donors:', error);
    return res.status(500).json({ message: 'Error fetching donors data' });
  }
});

// Route to serve static files (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Donor Server is running on http://localhost:${port}`);
});
