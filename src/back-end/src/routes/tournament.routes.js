const express = require('express');
const router = express.Router();
const { paginate } = require('../middlewares/paginate.middleware')

// Import the controller for tournaments
const tournamentController = require('../controllers/tournaments.controller');

// Import the middleware for authentication
const { isAuthenticated } = require('../middlewares/auth.middleware');

// Import the utility for uploading to S3
const { uploadToS3 } = require('../utils/s3.utils');

// Import Multer for handling file uploads
const multer = require('multer');

// Initialize Multer
const upload = multer();

// GET request to get all teams
router.get('/', isAuthenticated, paginate, tournamentController.getAllTournaments);



module.exports = router;