const { Players, User, Teams, Scorecard, Matches, Tournaments } = require("../models/index.model");
const sequelize = require("../config/db.config");
const { Op } = require('sequelize');
const { PLAYERS, SCORECARD } = require('../config/status.config')

// Retrieves all teams that belong to a particular user
async function getAllPlayers(userId, limit, offset, params, fields) {
    console.log(params)
    const whereClause = {
        status: PLAYERS.ACTIVE,
        user_id: userId,
        name: {
            [Op.like]: `%${params.name || ''}%`
        }
    };

    if (params.team) {
        whereClause.team_id = params.team;
    }
    // Find all teams with status 1 and the given user ID and search params
    const players = await Players.findAndCountAll({
        where: whereClause,
        attributes: fields,
        order: [
            ['updated_at', 'DESC'],
            ['id', 'ASC']
        ],
        include: fields.includes('team_id') ? [
            {
                model: Teams,
                as: "team",
                attributes: ["name"],
                required: false,
            }
        ] : null,
        limit,
        offset
    });
    return players
}

// Retrieves a player by ID, along with its team details
async function getPlayerById(userId, playerId) {
    // Find a player with status 1, the given user ID and player ID
    const player = await Players.findOne({
        where: {
            status: PLAYERS.ACTIVE,
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
    playersData = playersData.map(player => {
        if (player.team_id === 'null') {
            return { ...player, team_id: null };
        } else {
            return player
        }
    })
    const transaction = await sequelize.transaction();
    try {
        // Create the player with the given data and include its players in the transaction
        const player = await Players.bulkCreate(playersData, { transaction });

        // If the player is successfully created, commit the transaction
        await transaction.commit();
        return player;
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
        //update team_id to null for existing playes
        await Players.update({ "team_id": null }, { where: { team_id: playersData.team_id } })
        // Create the player with the given data in the transaction
        for (const playerId of playersData.players) {
            const player = await Players.findByPk(playerId)
            await player.update({ team_id: playersData.team_id }, { transaction });
        }

        // If the player is successfully created, commit the transaction
        await transaction.commit();
        return
    } catch (error) {
        // If there is an error, roll back the transaction and return error
        await transaction.rollback();
        global.logger.error(error.stack)
        return error;
    }
}

async function deletePlayers(playersData) {
    const transaction = await sequelize.transaction();
    try {

        // soft delete the players with the given ids 
        for (const playerId of playersData.ids) {
            const player = await Players.findByPk(playerId)
            if (player.status == PLAYERS.DELETED)
                throw new Error()
            await player.update({ status: PLAYERS.DELETED }, { transaction });
        }

        // If the player is successfully deleted, commit the transaction
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
    playerData.team_id = playerData.team_id == 'null' ? null : playerData.team_id
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

module.exports = { getAllPlayers, getPlayerById, createPlayers, updatePlayersTeam, updatePlayer, deletePlayers }