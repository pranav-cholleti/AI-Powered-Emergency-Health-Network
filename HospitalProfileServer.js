const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5004;

const url = 'mongodb://localhost:27017/'; // MongoDB connection string
const dbName = 'MedReady'; // Database name

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

    // Log the donation status (if any)
    if (hospital.donation && hospital.donation.trim() !== '') {
      console.log(`Donation present for ${username}: ${hospital.donation}`);
    } else {
      console.log(`No donation present for ${username}`);
    }

    res.json(hospital);
  } catch (error) {
    console.error('Error fetching hospital:', error);
    res.status(500).json({ message: 'Error fetching hospital data' });
  }
});

// Update hospital profile
app.put('/api/hospital/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const updatedData = req.body;

    // Only set the donation field if it is part of the update data
    if (!updatedData.hasOwnProperty('donation')) {
      // Get the current hospital data to preserve the donation field if not updated
      const currentHospital = await hospitalCollection.findOne({ username });

      if (currentHospital && currentHospital.donation) {
        // Preserve the donation field if not included in the update
        updatedData.donation = currentHospital.donation;
      }
    }

    // Update hospital data in the database
    const result = await hospitalCollection.updateOne(
      { username },
      { $set: updatedData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Hospital not found or no changes made' });
    }

    console.log(`Hospital profile updated for ${username}`);
    res.json({ message: 'Hospital profile updated successfully' });
  } catch (error) {
    console.error('Error updating hospital profile:', error);
    res.status(500).json({ message: 'Error updating hospital profile' });
  }
});

// Delete donation field
app.delete('/api/hospital/:username/donation', async (req, res) => {
  try {
    const { username } = req.params;

    const result = await hospitalCollection.updateOne(
      { username },
      { $unset: { donation: "" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Hospital not found or no donation present' });
    }

    console.log(`Donation removed for ${username}`);
    res.json({ message: 'Donation removed successfully' });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ message: 'Error deleting donation' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Hospital Server is running on http://localhost:${port}`);
});
