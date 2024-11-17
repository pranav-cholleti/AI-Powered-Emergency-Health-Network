const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');  // To hash passwords (optional, for production)

const app = express();
const port = 4000;

const url = 'mongodb://localhost:27017/';  // MongoDB connection string
const dbName = 'MedReady';  // Database name

let db;
let adminCollection;
let hospitalCollection;
let patientCollection;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files (e.g., login.html)

// Connect to MongoDB
MongoClient.connect(url)
  .then(client => {
    db = client.db(dbName);
    adminCollection = db.collection('Admin');
    hospitalCollection = db.collection('Hospitals');
    patientCollection = db.collection('Patients');
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit the process if DB connection fails
  });
  
// Admin login and patient/hospital login/signup
app.post('/login', async (req, res) => {
  const { username, password, role } = req.body;
  console.log('Received login request:', req.body);  // Log the request data

  try {
    if (role === 'admin') {
      const admin = await adminCollection.findOne({ username: username });
      if (admin) {
        // Compare password (using bcrypt if hashed)
        const isMatch = admin.password === password;  // Replace with bcrypt if hashed password
        if (isMatch) {
          return res.json({ success: true, message: 'Admin login successful!' });
        } else {
          return res.json({ success: false, message: 'Wrong username or password' });
        }
      } else {
        return res.json({ success: false, message: 'Admin not found' });
      }
    }

    // hospital login/signup
    if (role === 'hospital') {
      const hospital = await hospitalCollection.findOne({ username: username });
      if (hospital) {
        const isMatch = hospital.password === password;  // Replace with bcrypt if password is hashed
        if (isMatch) {
          return res.json({ success: true, message: 'hospital login successful!' });
        } else {
          return res.json({ success: false, message: 'Wrong password' });
        }
      } else {
        // New hospital registration
        await hospitalCollection.insertOne({ username: username, password: password });
        return res.json({ success: true, message: 'New hospital registered and logged in!' });
      }
    }

    // Patient login/signup
    if (role === 'patient') {
      const patient = await patientCollection.findOne({ username: username });
      if (patient) {
        const isMatch = patient.password === password;  // Replace with bcrypt if password is hashed
        if (isMatch) {
          return res.json({ success: true, message: 'Patient login successful!' });
        } else {
          return res.json({ success: false, message: 'Wrong password' });
        }
      } else {
        // New patient registration
        await patientCollection.insertOne({ username: username, password: password });
        return res.json({ success: true, message: 'New patient registered and logged in!' });
      }
    }

    return res.json({ success: false, message: 'Invalid role' });

  } catch (error) {
    console.error('Error during login:', error);  // Log the error
    return res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
  }
});

// Route to serve the login page (index.html) if needed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
