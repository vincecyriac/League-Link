const express = require('express');
const router = express.Router();

// Import the user controller
const userController = require('../controllers/users.controller')

// Create a new user
router.post('/', userController.createUser);

// Export the router
module.exports = router;
