// donorListRoutes.js
import express from 'express';
const router = express.Router();
import * as donorListController from './donorListController.js';

router.get('/api/donors', donorListController.getDonors);
router.delete('/api/donors/:username', donorListController.deleteDonor);
router.post('/api/donors', donorListController.addDonor);

export default router;