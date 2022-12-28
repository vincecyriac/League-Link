const teamsService = require("../services/teams.service");
const { NotFound } = require('../utils/errors.utils');
const { getSignedUrl } = require('../utils/s3.utils')

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
const getTeamById = (req, res, next) => {
    teamsService.getTeamById(req.tokenData.id, req.params.teamId)
        .then((team) => {
            if (team) {
                getSignedUrl(team.image_url)
                    .then((signedUrl) => {
                        team.image_url = signedUrl
                        res.send(team)
                    })
                    .catch((e) => {
                        next(e)
                    })
            } else {
                next(new NotFound("Team not found", 2001))
            }
        })
        .catch((e) => {
            next(e)
        })
}

const createTeam = async (req, res, next) => {
    req.body.user_id = req.tokenData.id
    teamsService.createTeam(req.body)
        .then((team) => {
            res.send({ message: 'Team created', id: team.id });
        })
        .catch((error) => {
            next(error);
        });
    return;
}


module.exports = { getAllTeams, getTeamById, createTeam };