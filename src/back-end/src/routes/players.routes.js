const express = require('express');
const router = express.Router();

// Import the middleware for authentication
const { isAuthenticated } = require('../middlewares/auth.middleware');

// Import the controller for players
const playersController = require('../controllers/players.controller');

// GET request to get all players
router.get('/', isAuthenticated, playersController.getAllPlayers);

// GET request to get a player by ID
router.get('/:playerId', isAuthenticated, playersController.getplayerById);

// POST request to create multiple players
router.post('/', isAuthenticated, playersController.createPlayers);

// PUT request to update team of multiple players
router.put('/team', isAuthenticated, playersController.updatePlayersTeam);

// PUT request to update individual player data
router.put('/:playerId', isAuthenticated, playersController.updatePlayer);

module.exports = router;