const express = require("express");
const cors = require("cors");
import path from 'path';
import dotenv from 'dotenv';
// Import route modules (not the entire files)
const hospitalRoutes = require("./HospitalsRoutes"); // Import the routes
const loginRoutes = require("./loginRoutes"); // assuming you have loginRoutes.js
const donorFormRoutes = require("./DonorFormRoutes"); // etc.
const donorsRoutes = require("./DonorsRoutes");
const contactRoutes = require("./ContactRoutes");
const contactListRoutes = require("./ContactListRoutes");
const hospitalProfileRoutes = require("./HospitalProfileRoutes");
const patientProfileRoutes = require("./PatientProfileRoutes");
const donorListRoutes = require("./DonorListRoutes");
const chatRoutes = require("./ChatRoutes");
dotenv.config();
const app = express();
const __dirname = path.resolve();
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,"/build")));
    app.get('*',(req,res)=>res.sendFile(path.resolve(__dirname,'build','index.html')));
}

// Enable CORS (Configure this properly for production!)
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Mount the routes
app.use('/hospitals', hospitalRoutes);
app.use('/login', loginRoutes);
app.use('/donor-form', donorFormRoutes);
app.use('/donors', donorsRoutes);
app.use('/contact', contactRoutes);
app.use('/contact-list', contactListRoutes);
app.use('/hospital-profile', hospitalProfileRoutes);
app.use('/patient-profile', patientProfileRoutes);
app.use('/donor-list', donorListRoutes);
app.use('/chat', chatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));