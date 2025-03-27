// hospitalRoutes.js
import express from 'express';
const router = express.Router();
import * as hospitalController from './HospitalController.js';

// Fetch all hospitals
router.get('/api/hospitals', hospitalController.getAllHospitals);

// Fetch recommended hospitals
router.get('/api/recommended-hospitals', hospitalController.getRecommendedHospitals);

export default router;