const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller')
const { isAuthenticated } = require('../middlewares/auth.middleware')

router.post('/', loginController.login);
router.get('/', isAuthenticated, loginController.getCurrentUser);

module.exports = router;