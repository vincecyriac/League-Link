const { Teams, Players } = require("../models/index.model");
const sequelize = require("../config/db.config");

// Retrieves all teams that belong to a particular user
async function getAllTeams(userId, teamId) {
    // Find all teams with status 1 and the given user ID
    const teams = await Teams.findAll({
        where: {
            status: 1,
            user_id: userId
        }
    });

    return teams;
}

// Retrieves a team by ID, along with its players
async function getTeamById(userId, teamId) {
    // Find a team with status 1, the given user ID and team ID
    // and include its players in the results
    const team = await Teams.findOne({
        where: {
            status: 1,
            user_id: userId,
            id: teamId
        },
        include: [
            {
                model: Players,
                as: "players",
                attributes: ["name", "id"]
            }
        ]
    });

    return team;
}

// Creates a new team
async function createTeam(teamData) {
    // Start a transaction
    const transaction = await sequelize.transaction();
    try {
        // Create the team with the given data and include its players in the transaction
        const team = await Teams.create(teamData, {
            include: [
                {
                    model: Players,
                    as: "players"
                }
            ],
            transaction
        });

        // If the team is successfully created, commit the transaction
        await transaction.commit();
        return team;
    } catch (error) {
        // If there is an error, roll back the transaction and throw a bad request error
        await transaction.rollback();
        throw new BadRequest(error, 500);
    }
}

module.exports = {
    getAllTeams,
    getTeamById,
    createTeam
};
