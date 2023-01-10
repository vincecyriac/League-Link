const teamsService = require('../services/teams.service');

// Get all teams for a user
const getAllTeams = async (req, res, next) => {
    try {
        const requiredFields = ["id", "user_id", "name", "manager", "image_url", "status", "created_at", "updated_at"]
        // Call the service function to get all teams for the user
        const teamsResponse = await teamsService.getAllTeams(req.tokenData.id, req.body.limit, req.body.offset, requiredFields);

        // Send the response back to the client
        res.send(teamsResponse);
    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        res.status(400).send({ message: "Something went wrong unexpectedly, Please find the log "});
    }
};

// Get all teams for a user
const getAllTeamsMiniList = async (req, res, next) => {
    try {
        const requiredFields = ["id", "name"]
        // Call the service function to get all teams for the user
        const teamsResponse = await teamsService.getAllTeams(req.tokenData.id, null, null, requiredFields);

        // Send the response back to the client
        res.send(teamsResponse);
    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        res.status(400).send({ message: "Something went wrong unexpectedly, Please find the log "});
    }
};

// Get a specific team for a user
const getTeamById = async (req, res, next) => {
    try {
        // Call the service function to get the team
        const team = await teamsService.getTeamById(req.tokenData.id, req.params.teamId);

        if (team) { 
            const signedUrl = await team.getSignedUrl();
            team.image_url = signedUrl
            res.send(team);
        } else {
            // If the team was not found, throw a NotFound error
            res.status(404).send({ message: "Team not found" });
        }
    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        res.status(400).send({ message: "Something went wrong unexpectedly, Please find the log "});
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
            return res.status(400).send({ message: "failed to create team, Please check yout input"});
        else
            // Send a response back to the client with the created team's ID
            res.send({ message: 'Team created', id: team.id });
    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        res.status(400).send({ message: "Something went wrong unexpectedly, Please find the log "});
    }
};

const updateTeam = async (req, res, next) => {
    try {
        // Call the service function to update the team
        const teamExist = await teamsService.getTeamById(req.tokenData.id, req.params.teamId);
        if (!teamExist) {
            // Return error response if team not found
            return res.status(404).send({ message: "Team not found" });
        }
        //update the team
        const team = await teamsService.updateTeam(req.params.teamId, req.body)
        if (team instanceof Error)
            return res.status(400).send({ message: "failed to update team, Please check yout input"});
        else
            // Return success response with team ID
            res.send({ message: "Team updated", id: team});

    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        res.status(400).send({ message: "Something went wrong unexpectedly, Please find the log "});
    }
};

module.exports = { getAllTeams, getTeamById, createTeam, updateTeam, getAllTeamsMiniList };
