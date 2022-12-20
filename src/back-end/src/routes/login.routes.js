const express = require('express');
const router = express.Router();
const { login, getCurrentUser, refreshToken } = require('../controllers/login.controller')
const { isAuthenticated, isValidRefreshToken } = require('../middlewares/auth.middleware')

router.post('/', login);
router.get('/', isAuthenticated, getCurrentUser);
router.put('/', isValidRefreshToken, refreshToken);

module.exports = router;