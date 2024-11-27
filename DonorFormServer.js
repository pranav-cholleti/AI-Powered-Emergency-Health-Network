const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/MedReady', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check MongoDB connection
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Mongoose schema for Patients and Hospitals
const patientSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  donation: { type: String, required: true },
}, { collection: 'Patients' });

const hospitalSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  donation: { type: String, required: true },
}, { collection: 'Hospitals' });

// Create Mongoose models
const Patient = mongoose.model('Patient', patientSchema);
const Hospital = mongoose.model('Hospital', hospitalSchema);

// POST endpoint for submitting donor data
app.post('/api/donors', async (req, res) => {
  const { username, donation, role } = req.body;

  try {
    if (role === 'patient') {
      // Update or add donation for patient
      const patient = await Patient.findOneAndUpdate(
        { username },
        { $set: { donation } },
        { new: true, upsert: true }
      );

      return res.json({ success: true, data: patient });
    } else if (role === 'hospital') {
      // Update or add donation for hospital
      const hospital = await Hospital.findOneAndUpdate(
        { username },
        { $set: { donation } },
        { new: true, upsert: true }
      );

      return res.json({ success: true, data: hospital });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
  } catch (error) {
    console.error("Error saving donor data:", error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
});

// Start the server
const port = 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
