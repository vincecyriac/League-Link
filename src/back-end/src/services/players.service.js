const { Players, User, Teams } = require("../models/index.model");
const sequelize = require("../config/db.config");

// Retrieves all teams that belong to a particular user
async function getAllPlayers(userId) {
    // Find all teams with status 1 and the given user ID
    const players = await Players.findAndCountAll({
        where: {
            status: 1,
            user_id: userId
        },
        attributes: ["id", "user_id", "team_id", "name", "phone", "status", "created_at", "updated_at"],
        order: [
            ['updated_at', 'DESC']
        ],
        include: [
            {
                model: Teams,
                as: "team",
                attributes: ["name"],
                required: false
            }
        ]
    });
    return players
}

// Retrieves a player by ID, along with its team details
async function getPlayerId(userId, playerId) {
    // Find a player with status 1, the given user ID and player ID
    const player = await Players.findOne({
        where: {
            status: 1,
            user_id: userId,
            id: playerId
        },
        attributes: ["id", "user_id", "team_id", "name", "phone", "status", "created_at", "updated_at"],
        include: [
            {
                model: Teams,
                as: "team",
                attributes : ["id", "name", "manager", "status"]
            }
        ]
    });
    return player;
}

// Retrieves a player by ID, along with its team details
async function createPlayers(playersData) {
    const transaction = await sequelize.transaction();
    try {
        // Create the team with the given data and include its players in the transaction
        const team = await Players.bulkCreate(playersData, { transaction });

        // If the team is successfully created, commit the transaction
        await transaction.commit();
        return team;
    } catch (error) {
        // If there is an error, roll back the transaction and throw a bad request error
        await transaction.rollback();
        return error
    }
}

module.exports = { getAllPlayers, getPlayerId, createPlayers }