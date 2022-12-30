const playersService = require('../services/players.service');

const getAllPlayers = async (req, res, next) => {
    try {
        // Call the service function to get all players for the user
        const players = await playersService.getAllPlayers(req.tokenData.id);

        // Send the response back to the client
        res.send(players);
    } catch (error) {
        // return bad request
        res.status(400).send({ message: "Something went wrong", trace: process.env.APP_ENV != 'prod' ? error.stack : "Cannot trace the error, Please find the log" });
    }
};

const getplayerById = async (req, res, next) => {
    try {
        // Call the service function to get the player
        const player = await playersService.getPlayerId(req.tokenData.id, req.params.playerId);
        if (player) {
            res.send(player);
        } else {
            // If the team was not found, throw a NotFound error
            res.status(404).send({ message: "Player not found" });
        }
    } catch (error) {
        // return bad request
        res.status(400).send({ message: "Something went wrong", trace: process.env.APP_ENV != 'prod' ? error.stack : "Cannot trace the error, Please find the log" });
    }
};

const createPlayers = async (req, res, next) => {
    try {
        // Call the service function to create the team
        req.body = req.body.map(item => { return { ...item, user_id: req.tokenData.id }; });

        const team = await playersService.createPlayers(req.body);
        if (team instanceof Error)
            return res.status(400).send({ message: "Failed to create players, Please check yout input"});
        else
            // Send a response back to the client with the created team's ID
            res.send({ message: 'Players created'});
    } catch (error) {
        // return bad request
        res.status(400).send({ message: "Something went wrong", trace: process.env.APP_ENV != 'prod' ? error.stack : "Cannot trace the error, Please find the log" });
    }
};

module.exports = { getAllPlayers, getplayerById, createPlayers }