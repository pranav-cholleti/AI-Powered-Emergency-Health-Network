// hospitalProfileRoutes.js
import express from 'express';
const router = express.Router();
import * as hospitalProfileController from './hospitalProfileController.js';

router.get('/api/hospital/:username', hospitalProfileController.getHospital);
router.put('/api/hospital/:username', hospitalProfileController.updateHospital);
router.delete('/api/hospital/:username/donation', hospitalProfileController.deleteDonation);

export default router;