const teamsService = require('../services/teams.service');
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
        res.status(400).send({ message: "Something went wrong", trace: process.env.APP_ENV != 'prod' ? error.stack : "Cannot trace the error, Please find the log" });
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
            res.status(404).send({ message: "Team not found" });
        }
    } catch (error) {
        // return bad request
        res.status(400).send({ message: "Something went wrong", trace: process.env.APP_ENV != 'prod' ? error.stack : "Cannot trace the error, Please find the log" });
    }
};

// Create a new team
const createTeam = async (req, res, next) => {
    try {
        // Add the user ID to the request body
        req.body.user_id = req.tokenData.id;

        // Call the service function to create the team
        const team = await teamsService.createTeam(req.body);
        if (team instanceof Error)
            return res.status(400).send({ message: "failed to create team", errors: team.errors.map(x => x.message) || team});
        else
            // Send a response back to the client with the created team's ID
            res.send({ message: 'Team created', id: team.id });
    } catch (error) {
        // return bad request
        res.status(400).send({ message: "Something went wrong", trace: process.env.APP_ENV != 'prod' ? error.stack : "Cannot trace the error, Please find the log" });
    }
};

const updateTeam = async (req, res, next) => {
    try {
        // Call the service function to update the team
        const teamExist = await teamsService.getTeamById(req.tokenData.id, req.params.teamId);
        if (!teamExist) {
            // Return error response if email is already in use
            return res.status(404).send({ message: "Team not found" });
        }
        //update the team
        const team = await teamsService.updateTeam(req.params.teamId, req.body)
        if (team instanceof Error)
            return res.status(400).send({ message: "failed to update team", errors: team.errors?.map(x => x.message) || team});
        else
            // Return success response with team ID
            res.send({ message: "Team updated", id: team});

    } catch (error) {
        console.log(error)
        // If there is an error, return a bad request response
        res.status(400).send({ message: "Something went wrong", trace: process.env.APP_ENV != 'prod' ? error.stack : "Cannot trace the error, Please find the log" });
    }
};

module.exports = { getAllTeams, getTeamById, createTeam, updateTeam };
