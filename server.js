import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import route modules (not the entire files)
import hospitalRoutes from "./HospitalsRoutes.js"; // Import the routes
import loginRoutes from "./loginRoutes.js"; // assuming you have loginRoutes.js
import donorFormRoutes from "./DonorFormRoutes.js"; // etc.
import donorsRoutes from "./DonorsRoutes.js";
import contactRoutes from "./ContactRoutes.js";
import contactListRoutes from "./ContactListRoutes.js";
import hospitalProfileRoutes from "./HospitalProfileRoutes.js";
import patientProfileRoutes from "./PatientProfileRoutes.js";
import donorListRoutes from "./DonorListRoutes.js";
import chatRoutes from "./ChatRoutes.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enable CORS (Configure this properly for production!)
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());
app.use('/donors', donorsRoutes);
app.use('/donor-list', donorListRoutes);
// Mount the routes
app.use('/hospitals', hospitalRoutes);
app.use('/login', loginRoutes);
app.use('/donor-form', donorFormRoutes);
app.use('/contact', contactRoutes);
app.use('/contact-list', contactListRoutes);
app.use('/hospital-profile', hospitalProfileRoutes);
app.use('/patient-profile', patientProfileRoutes);
app.use('/chat', chatRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,"/build")));
    app.get('*',(req,res)=>res.sendFile(path.resolve(__dirname,'build','index.html')));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));