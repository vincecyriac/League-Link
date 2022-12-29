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
                // attributes: ["name", "id"]
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

        // Delete all players associated with the team
        await Players.destroy({
            where: { team_id: teamId },
            transaction
        });

        // Create a new set of players for the team
        const players = teamData.players.map(player => ({ ...player, team_id: teamId }));
        await Players.bulkCreate(players, { transaction });

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
