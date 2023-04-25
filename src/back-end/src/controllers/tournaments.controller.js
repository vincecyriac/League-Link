const tournamentService = require('../services/tournaments.service');
const { BadRequestException } = require('../utils/errors.utils');

// Get all teams for a user
const getAllTournaments = async (req, res, next) => {
    try {
        // Call the service function to get all tourna for the user
        const teamsResponse = await tournamentService.getAllTournaments(req.tokenData.id, req.body.limit, req.body.offset);

        // Send the response back to the client
        res.send(teamsResponse);
    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        next(new BadRequestException())
    }
};

module.exports = { getAllTournaments }