const { Teams } = require('../models/index.model');

const getAllTeams = async (userId) => {
    const user = await Teams.findAll({ where: { status : 1, user_id : userId } });
    return user;
}
module.exports = { getAllTeams }