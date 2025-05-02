// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { Signup, Login } = require('../controllers/AuthController');

router.post('/signup', Signup);
router.post('/signin', Login);

module.exports = router;
