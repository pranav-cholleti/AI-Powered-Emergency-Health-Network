// geminiRoutes.js
import express from 'express';
const router = express.Router();
import * as geminiController from './geminiController.js'; // Add .js extension and use import

router.post('/chatbot', geminiController.handleChat);

export default router; // Use export default