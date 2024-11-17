const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const port = 5002; // Port for your API

// Middleware setup
app.use(cors()); // Enable Cross-Origin requests
app.use(bodyParser.json()); // Parse JSON body

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/MedReady';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Define the Contact model
const contactSchema = new mongoose.Schema({
  username: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// POST route to handle contact form submission
app.post('/api/contact', async (req, res) => {
  const { username, description } = req.body;

  if (!username || !description) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Create a new contact document
    const newContact = new Contact({
      username,
      description
    });

    // Save to MongoDB
    await newContact.save();

    res.status(200).json({ success: true, message: 'Query submitted successfully' });
  } catch (error) {
    console.error('Error saving contact data:', error);
    res.status(500).json({ success: false, message: 'An error occurred. Please try again later' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
