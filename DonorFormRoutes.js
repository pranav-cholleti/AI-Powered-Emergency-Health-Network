// donorFormRoutes.js
import express from 'express';
const router = express.Router();
import * as donorFormController from './donorFormController.js';

router.post('/api/donors', donorFormController.submitDonorData);

export default router;