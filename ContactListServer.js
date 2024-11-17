const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5003;  // Changed Port to 5003 for Contacts

const url = 'mongodb://localhost:27017/';  // MongoDB connection string
const dbName = 'MedReady';  // Database name

let db;
let contactsCollection;  // For Contacts collection

// Enable CORS for all routes (important for cross-origin requests from React)
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(url)
  .then(client => {
    db = client.db(dbName);
    contactsCollection = db.collection('contacts');  // Contacts collection
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit the process if DB connection fails
  });

// Fetch contacts data
app.get('/api/contacts', async (req, res) => {
  try {
    // Fetch all contacts from the 'Contacts' collection
    const contacts = await contactsCollection.find().toArray();

    // Extract relevant fields: username, description, createdAt
    const contactData = contacts.map(contact => ({
      username: contact.username,
      description: contact.description || 'No description available',  // Default description if missing
      createdAt: contact.createdAt || 'Not Available'  // Default createdAt if missing
    }));

    res.json(contactData);  // Send the filtered data as JSON response
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({ message: 'Error fetching contacts data' });
  }
});

// Route to serve static files (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Contact Server is running on http://localhost:${port}`);
});
