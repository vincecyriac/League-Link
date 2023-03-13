const express = require('express');
const router = express.Router();

// Import login controller functions
const { login, getCurrentUser, refreshToken } = require('../controllers/login.controller');

// Import authentication middleware functions
const { isAuthenticated, isValidRefreshToken } = require('../middlewares/auth.middleware');

//validators
const { loginValidator } = require('../vaidators/login.validator');


// Route for logging in
router.post('/', loginValidator, login);

// Route for getting current user's information (protected route, requires authentication)
router.get('/', isAuthenticated, getCurrentUser);

// Route for refreshing access token (protected route, requires valid refresh token)
router.put('/', isValidRefreshToken, refreshToken);

module.exports = router;
