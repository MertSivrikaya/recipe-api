const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// The Authentication Route
// This provides the URL endpoint for clients to submit their credentials and receive a JWT.
// Because this router will be mounted at /api/auth, the full URL will be POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;

