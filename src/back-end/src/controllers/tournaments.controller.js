const tournamentService = require('../services/tournaments.service');

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
        res.status(400).send({ message: "Something went wrong unexpectedly, Please find the log "});
    }
};

module.exports = { getAllTournaments }