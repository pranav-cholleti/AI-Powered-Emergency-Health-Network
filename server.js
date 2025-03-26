const express = require("express");
const cors = require("cors");

// Import all backend services
require("./HospitalsServer");
require("./loginServer");
require("./DonorFormServer");
require("./DonorsServer");
require("./ContactServer");
require("./ContactListServer");
require("./HospitalProfileServer");
require("./PatientProfileServer");
require("./DonorListServer");
require("./ChatServer");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
