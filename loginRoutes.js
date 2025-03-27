// loginRoutes.js
import express from 'express';
const router = express.Router();
import * as loginController from './loginController.js';

router.post('/Login', loginController.handleLogin);

export default router;