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
async function getPlayerById(userId, playerId) {
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
                attributes: ["id", "name", "manager", "status"]
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
        // If there is an error, roll back the transaction and return error
        await transaction.rollback();
        global.logger.error(error.stack)
        return error
    }
}

async function updatePlayersTeam(playersData) {
    const transaction = await sequelize.transaction();
    try {
        // Create the team with the given data and include its players in the transaction
        for (const playerId of playersData.players) {
            const player = await Players.findByPk(playerId)
            await player.update({ team_id: playersData.team_id },{ transaction });
        }

        // If the team is successfully created, commit the transaction
        await transaction.commit();
        return
    } catch (error) {
        // If there is an error, roll back the transaction and return error
        await transaction.rollback();
        global.logger.error(error.stack)
        return error;
    }
}

async function updatePlayer(playerId, playerData) {
    // Start a transaction
    const transaction = await sequelize.transaction();
    
    try {
        // Update the player with the new data
        await Players.update(playerData, {
            where: { id: playerId },
            transaction,
        });

        // If there are no errors, commit the transaction
        await transaction.commit();

        return playerId;
    } catch (error) {
        // If there is an error, roll back the transaction and return error
        await transaction.rollback();
        global.logger.error(error.stack)
        return error
    }
}

module.exports = { getAllPlayers, getPlayerById, createPlayers, updatePlayersTeam, updatePlayer }