// hospitalProfileRoutes.js
const express = require('express');
const router = express.Router();
const hospitalProfileController = require('./hospitalProfileController');

router.get('/api/hospital/:username', hospitalProfileController.getHospital);
router.put('/api/hospital/:username', hospitalProfileController.updateHospital);
router.delete('/api/hospital/:username/donation', hospitalProfileController.deleteDonation);

module.exports = router;