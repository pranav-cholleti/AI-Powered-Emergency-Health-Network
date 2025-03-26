// donorsRoutes.js
const express = require('express');
const router = express.Router();
const donorsController = require('./donorsController');

router.get('/api/donors', donorsController.getDonors);
router.get('/api/user-location', donorsController.getUserLocation);
router.get('/api/user-blood-group', donorsController.getUserBloodGroup);

module.exports = router;