// donorsRoutes.js
import express from 'express';
const router = express.Router();
import * as donorsController from './donorsController.js';

router.get('/api/donors', donorsController.getDonors);
router.get('/api/user-location', donorsController.getUserLocation);
router.get('/api/user-blood-group', donorsController.getUserBloodGroup);

export default router;