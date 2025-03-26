// contactListRoutes.js
const express = require('express');
const router = express.Router();
const contactListController = require('./contactListController');

// Fetch contacts data
router.get('/api/contacts', contactListController.getContacts);

module.exports = router;