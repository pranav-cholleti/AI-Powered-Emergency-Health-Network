// hospitalRoutes.js
const express = require('express');
const router = express.Router();
const hospitalController = require('./hospitalController');

// Fetch all hospitals
router.get('/all', hospitalController.getAllHospitals);

// Fetch recommended hospitals
router.get('/recommended', hospitalController.getRecommendedHospitals);

module.exports = router;