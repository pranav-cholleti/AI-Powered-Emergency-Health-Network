const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/MedReady", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Donor Schema
const donorSchema = new mongoose.Schema({
  username: { type: String, required: true },
  donation: { type: String, required: true },
  email: { type: String, required: true },
});

// Define model with the explicit collection name 'Donors'
const Donor = mongoose.model("Donor", donorSchema, "Donors");

// POST endpoint to add a donor
app.post("/api/donors", async (req, res) => {
  const { username, donation, email } = req.body;

  if (!username || !donation || !email) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    const newDonor = new Donor({
      username,
      donation,
      email,
    });
    await newDonor.save();
    res.status(201).json({ success: true, message: "Donor added successfully." });
  } catch (error) {
    console.error("Error saving donor:", error);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
