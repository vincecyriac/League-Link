const express = require('express');
const router = express.Router();
const { paginate } = require('../middlewares/paginate.middleware')

// Import the controller for teams
const teamsController = require('../controllers/teams.controller');

// Import the middleware for authentication
const { isAuthenticated } = require('../middlewares/auth.middleware');

// Import the utility for uploading to S3
const { uploadToS3 } = require('../utils/s3.utils');

// Import Multer for handling file uploads
const multer = require('multer');

// Initialize Multer
const upload = multer();

// GET request to get all teams
router.get('/', isAuthenticated, paginate, teamsController.getAllTeams);

// GET request to get all teams with name and id only
router.get('/mini', isAuthenticated, teamsController.getAllTeamsMiniList);

// GET request to get a team by ID
router.get('/:teamId', isAuthenticated, teamsController.getTeamById);

// POST request to create a new team
router.post('/', isAuthenticated, upload.single('image'), uploadToS3, teamsController.createTeam);

// PUT request to update a team
router.put('/:teamId', isAuthenticated, upload.single('image'), uploadToS3, teamsController.updateTeam);

module.exports = router;