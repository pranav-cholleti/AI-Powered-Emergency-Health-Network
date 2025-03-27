// contactRoutes.js
import express from 'express';
const router = express.Router();
import * as contactController from './contactController.js';

router.post('/api/contact', contactController.submitContactForm);

export default router;