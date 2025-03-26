// loginRoutes.js
import express from 'express';
import loginController from './loginController';
const router = express.Router();

router.post('/Login', loginController.handleLogin);

module.exports = router;