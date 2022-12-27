const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teams.controller')
const { isAuthenticated } = require('../middlewares/auth.middleware')


router.get('/',isAuthenticated, teamsController.getAllTeams);

module.exports = router;