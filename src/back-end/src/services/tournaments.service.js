const { Tournaments, Teams, Matches } = require("../models/index.model");
const sequelize = require("../config/db.config");
const { deleteFromS3 } = require("../utils/s3.utils")

// Retrieves all teams that belong to a particular user
async function getAllTournaments(userId, limit, offset) {
    // Find all teams with status 1 and the given user ID
    const tournaments = await Tournaments.findAndCountAll({
        where: {
            status: 1,
            user_id: userId
        },
        attributes: ["id", "user_id", "name", "start_date", "end_date", "number_of_teams", "image_url", "status", "created_at", "updated_at"],
        order: [
            ['start_date', 'DESC']
        ],
        limit,
        offset
    });

    // Modify each team to include a signed URL for their image
    const modifiedTournaments = tournaments.rows.map(async tournament => {
        const signedUrl = await tournament.getSignedUrl();
        return { ...tournament.dataValues, image_url: signedUrl };
    });

    // Wait for all modified teams to be processed and return the response
    tournaments.rows = await Promise.all(modifiedTournaments);
    return tournaments;

}

module.exports = { getAllTournaments }