// patientProfileRoutes.js
import express from 'express';
const router = express.Router();
import * as patientProfileController from './patientProfileController.js';

router.get('/api/patient/:username', patientProfileController.getPatient);
router.put('/api/patient/:username', patientProfileController.updatePatient);
router.delete('/api/patient/:username/donation', patientProfileController.deleteDonation);

export default router;