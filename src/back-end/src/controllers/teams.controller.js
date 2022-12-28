const teamsService = require('../services/teams.service');
const { NotFound } = require('../utils/errors.utils');
const { getSignedUrl } = require('../utils/s3.utils');

// Get all teams for a user
const getAllTeams = async (req, res, next) => {
    try {
        // Call the service function to get all teams for the user
        const teamsResponse = await teamsService.getAllTeams(req.tokenData.id);

        // Send the response back to the client
        res.send(teamsResponse);
    } catch (error) {
        // return bad request
        throw new BadRequest(error, 500);
    }
};

// Get a specific team for a user
const getTeamById = async (req, res, next) => {
    try {
        // Call the service function to get the team
        const team = await teamsService.getTeamById(req.tokenData.id, req.params.teamId);

        if (team) {
            // If the team was found, get a signed URL for the team image
            const signedUrl = await getSignedUrl(team.image_url);

            // Add the signed URL to the team object and send it back to the client
            team.image_url = signedUrl;
            res.send(team);
        } else {
            // If the team was not found, throw a NotFound error
            throw new NotFound('Team not found', 2001);
        }
    } catch (error) {
        // return bad request
        throw new BadRequest(error, 500);
    }
};

// Create a new team
const createTeam = async (req, res, next) => {
    try {
        // Add the user ID to the request body
        req.body.user_id = req.tokenData.id;

        // Call the service function to create the team
        const team = await teamsService.createTeam(req.body);

        // Send a response back to the client with the created team's ID
        res.send({ message: 'Team created', id: team.id });
    } catch (error) {
        // return bad request
        throw new BadRequest(error, 500);
    }
};

module.exports = { getAllTeams, getTeamById, createTeam };
