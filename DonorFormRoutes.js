// donorFormRoutes.js
const express = require('express');
const router = express.Router();
const donorFormController = require('./donorFormController');

router.post('/api/donors', donorFormController.submitDonorData);

module.exports = router;