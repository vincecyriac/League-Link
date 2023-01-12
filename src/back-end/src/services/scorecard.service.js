const { Scorecard,Tournaments, Teams, Matches } = require("../models/index.model");
const sequelize = require("../config/db.config");

// Retrieves all teams that belong to a particular user
async function getScoreCardByPlayer(playerId, fields) {
    const scores = await Scorecard.findAndCountAll({
            where: {
                status: 1,
                player_id: playerId
            },
            attributes: fields,
            // include : [
            //     {
            //         model: Teams,
            //         as: "team",
            //         attributes: ["id", "name"]
            //     }
            // ],
            order: [
                ['updated_at', 'DESC']
            ],
        });
    return scores;

}

module.exports = { getScoreCardByPlayer }
