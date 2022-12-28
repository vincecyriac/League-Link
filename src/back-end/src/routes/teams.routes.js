const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teams.controller')
const { isAuthenticated } = require('../middlewares/auth.middleware')
const { uploadToS3 } = require('../utils/s3.utils')
const multer  = require('multer')
const upload = multer()


router.get('/',isAuthenticated, teamsController.getAllTeams);
router.get('/:teamId',isAuthenticated, teamsController.getTeamById);
router.post('/',isAuthenticated,upload.single('image'), uploadToS3, teamsController.createTeam);

module.exports = router;
