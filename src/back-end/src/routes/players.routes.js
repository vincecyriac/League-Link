const express = require('express');
const router = express.Router();
const { paginate } = require('../middlewares/paginate.middleware')

// Import the middleware for authentication
const { isAuthenticated } = require('../middlewares/auth.middleware');

// Import the controller for players
const playersController = require('../controllers/players.controller');

// GET request to get all players
router.get('/', isAuthenticated, paginate, playersController.getAllPlayers);

// GET request to get all players mini list with name and id
router.get('/mini', isAuthenticated, playersController.getAllPlayersMiniList);

// GET request to get a player by ID
router.get('/:playerId', isAuthenticated, playersController.getplayerById);

// POST request to create multiple players
router.post('/', isAuthenticated, playersController.createPlayers);

// PUT request to update team of multiple players
router.put('/team', isAuthenticated, playersController.updatePlayersTeam);

// PUT request to update team of multiple players
router.delete('/', isAuthenticated, playersController.deletePlayers);

// PUT request to update individual player data
router.put('/:playerId', isAuthenticated, playersController.updatePlayer);

module.exports = router;