const playersService = require('../services/players.service');

const getAllPlayers = async (req, res, next) => {
    try {
        // Call the service function to get all players for the user
        const requiredFields = ["id", "user_id", "team_id", "name", "phone", "status", "created_at", "updated_at"];
        const players = await playersService.getAllPlayers(req.tokenData.id, req.body.limit, req.body.offset, req.query, requiredFields);

        // Send the response back to the client
        res.send(players);
    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        res.status(400).send({ message: "Something went wrong unexpectedly, Please find the log "});
    }
};

const getAllPlayersMiniList = async (req, res, next) => {
    try {
        // Call the service function to get all players for the user
        const requiredFields = ["id", "name"];
        const players = await playersService.getAllPlayers(req.tokenData.id, null, null, req.query, requiredFields);

        // Send the response back to the client
        res.send(players);
    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        res.status(400).send({ message: "Something went wrong unexpectedly, Please find the log "});
    }
};

const getplayerById = async (req, res, next) => {
    try {
        // Call the service function to get the player
        const player = await playersService.getPlayerById(req.tokenData.id, req.params.playerId);
        if (player) {
            res.send(player);
        } else {
            // If the team was not found, throw a NotFound error
            res.status(404).send({ message: "Player not found" });
        }
    } catch (error) {
        console.log(error)
        // return bad request
        global.logger.error(error.stack)
        res.status(400).send(error);
    }
};

const createPlayers = async (req, res, next) => {
    console.log(req.file)
    try {
        // Call the service function to create players
        req.body = req.body.map(item => { return { ...item, user_id: req.tokenData.id }; });
        const players = await playersService.createPlayers(req.body);
        if (players instanceof Error)
            return res.status(400).send({ message: "Failed to create players, Please check yout input"});
        else
            // Send a response back to the client with the created players's ID
            res.send({ message: 'Players created', pids : players.map(player => {return player.id})});
    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        res.status(400).send({ message: "Something went wrong unexpectedly, Please find the log "});
    }
};

const updatePlayersTeam = async (req, res, next) => {
    try {
        // Call the service function to update players
        const players = await playersService.updatePlayersTeam(req.body);
        if (players instanceof Error)
            return res.status(400).send({ message: "Failed to update players team, Please check yout input"});
        else
            // Send a response back to the client
            res.send({ message: 'Players team updated'});
    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        res.status(400).send({ message: "Something went wrong unexpectedly, Please find the log "});
    }
};

const deletePlayers = async (req, res, next) => {
    try {
        // Call the service function to update players
        const players = await playersService.deletePlayers(req.body);
        if (players instanceof Error)
            return res.status(400).send({ message: "Failed to delete players, Please check yout input"});
        else
            // Send a response back to the client
            res.send({ message: 'Players deleted'});
    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        res.status(400).send({ message: "Something went wrong unexpectedly, Please find the log "});
    }
};

const updatePlayer = async (req, res, next) => {
    try {
        // Call the service function to update the player
        const playerExist = await playersService.getPlayerById(req.tokenData.id, req.params.playerId);
        if (!playerExist) {
            // Return error response if player not found
            return res.status(404).send({ message: "Player not found" });
        }
        //update the player
        const player = await playersService.updatePlayer(req.params.playerId, req.body)
        if (player instanceof Error)
            return res.status(400).send({ message: "failed to update player, Please check yout input"});
        else
            // Return success response with player ID
            res.send({ message: "player updated", id: player});

    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        res.status(400).send({ message: "Something went wrong unexpectedly, Please find the log "});
    }
};

module.exports = { getAllPlayers, getplayerById, createPlayers, updatePlayersTeam, updatePlayer, getAllPlayersMiniList, deletePlayers }