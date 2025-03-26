// contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('./contactController');

router.post('/api/contact', contactController.submitContactForm);

module.exports = router;