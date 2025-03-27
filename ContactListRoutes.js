// contactListRoutes.js
import express from 'express';
const router = express.Router();
import * as contactListController from './contactListController.js';

// Fetch contacts data
router.get('/api/contacts', contactListController.getContacts);

export default router;