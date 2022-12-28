const { Teams, Players } = require('../models/index.model');

//function to get all teams
const getAllTeams = async (userId, teamId) => {
    const user = await Teams.findAll({ where: { status: 1, user_id: userId } });
    return user;
}

const getTeamById = async (userId, teamId) => {
    const user = await Teams.findOne({ 
        where: { status: 1, user_id: userId, id: teamId },
        include: [
            {
                model: Players,
                as: 'players',
                attributes : ['name', 'id']
            }
        ]
     });
    return user;
}

const createTeam = async (teamData) => {
    console.log(teamData)
    const team = await Teams.create(teamData, {
        include: [
            {
                model: Players,
                as: 'players'
            }
        ]
    })
    return team
}
module.exports = { getAllTeams, getTeamById, createTeam }