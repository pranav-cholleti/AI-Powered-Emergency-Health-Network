// geminiRoutes.js
const express = require('express');
const router = express.Router();
const geminiController = require('./geminiController');

router.post('/chat', geminiController.handleChat);

module.exports = router;