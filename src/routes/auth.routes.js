const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// The Authentication Route
// This provides the URL endpoint for clients to submit their credentials and receive a JWT.
// Because this router will be mounted at /api/auth, the full URL will be POST /api/auth/login

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to receive an authentication token
 *     description: Authenticates a user and returns a JWT token required to access protected recipe routes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful. Returns the JWT token.
 *       400:
 *         description: Bad request (missing username or password).
 *       401:
 *         description: Unauthorized (invalid credentials).
 */
router.post('/login', authController.login);

module.exports = router;

