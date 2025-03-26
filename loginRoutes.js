// loginRoutes.js
const express = require('express');
const router = express.Router();
const loginController = require('./loginController');

router.post('/Login', loginController.handleLogin);

module.exports = router;