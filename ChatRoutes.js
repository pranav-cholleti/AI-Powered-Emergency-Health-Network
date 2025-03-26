// geminiRoutes.js
import express from 'express';
const router = express.Router();
const geminiController = require('./geminiController');

router.post('/chatbot', geminiController.handleChat);

module.exports = router;