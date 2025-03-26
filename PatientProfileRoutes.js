// patientProfileRoutes.js
const express = require('express');
const router = express.Router();
const patientProfileController = require('./patientProfileController');

router.get('/api/patient/:username', patientProfileController.getPatient);
router.put('/api/patient/:username', patientProfileController.updatePatient);
router.delete('/api/patient/:username/donation', patientProfileController.deleteDonation);

module.exports = router;