// donorListRoutes.js
const express = require('express');
const router = express.Router();
const donorListController = require('./donorListController');

router.get('/api/donors', donorListController.getDonors);
router.delete('/api/donors/:username', donorListController.deleteDonor);
router.post('/api/donors', donorListController.addDonor);

module.exports = router;