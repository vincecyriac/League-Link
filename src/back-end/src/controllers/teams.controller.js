const teamsService = require("../services/teams.service");

const getAllTeams = async (req, res, next) => {
    teamsService.getAllTeams(req.tokenData.id)
        .then((teamsResponse) => {
            res.send(teamsResponse);
        })
        .catch((error) => {
            next(error);
        });
    return;
}


module.exports = { getAllTeams };