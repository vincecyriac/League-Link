const { Teams, Players } = require("../models/index.model");
const sequelize = require("../config/db.config");

// Retrieves all teams that belong to a particular user
async function getAllTeams(userId) {
    // Find all teams with status 1 and the given user ID
    const teams = await Teams.findAndCountAll({
        where: {
            status: 1,
            user_id: userId
        },
        attributes: ["id", "user_id", "name", "manager", "image_url", "status", "created_at", "updated_at"],
        order: [
            ['updated_at', 'DESC']
        ]
    });

    // Modify each team to include a signed URL for their image
    const modifiedTeams = teams.rows.map(async team => {
        const signedUrl = await team.getSignedUrl();
        return { ...team.dataValues, image_url: signedUrl };
    });

    // Wait for all modified teams to be processed and return the response
    teams.rows = await Promise.all(modifiedTeams);
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
        attributes: ["id", "user_id", "name", "manager", "image_url", "status", "created_at", "updated_at"],
        include: [
            {
                model: Players,
                as: "players",
                attributes: ["id", "name", "phone"],
                where: {
                    status: 1
                },
                required: false
            }
        ]
    });
    const signedUrl = await team.getSignedUrl();
    team.image_url = signedUrl

    return team;
}

// Creates a new team
async function createTeam(teamData) {
    // Start a transaction
    const transaction = await sequelize.transaction();
    try {
        // Create the team with the given data and include its players in the transaction
        const team = await Teams.create(teamData, { transaction });

        // If the team is successfully created, commit the transaction
        await transaction.commit();
        return team;
    } catch (error) {
        // If there is an error, roll back the transaction and throw a bad request error
        await transaction.rollback();
        return error
    }
}

async function updateTeam(teamId, teamData) {
    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // Update the team with the new data
        await Teams.update(teamData, {
            where: { id: teamId },
            transaction,
        });

        // If there are no errors, commit the transaction
        await transaction.commit();

        return teamId;
    } catch (error) {
        // If there is an error, roll back the transaction and throw a bad request error
        await transaction.rollback();
        return error
    }
}


module.exports = { getAllTeams, getTeamById, createTeam, updateTeam };
