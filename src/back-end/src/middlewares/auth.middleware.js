const userService = require('../services/users.service')
const { Unauthorized } = require("../utils/errors.utils");
const { verify } = require("jsonwebtoken");
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
})

const isAuthenticated = async (req, res, next) => {
    const accessToken = req.header('Authorization');
    if (!accessToken || !accessToken.startsWith('LEAGUE_LINK')) {
         next(new Unauthorized('You are not authorized'));
    } else {
        verify(accessToken.split(' ')[1], process.env.JWT_KEY, (error, tokenData) => {
            if (error|| tokenData.type != 0) {
                next(new Unauthorized('Invalid Token'));
            }
            else{
                req.tokenData = tokenData
                next()
            }
        });
    }
}

const isValidRefreshToken = async (req, res, next) => {
    verify(req.body.refreshToken, process.env.JWT_KEY, (error, tokenData) => {
        if (error || tokenData.type != 1) {
            next(new Unauthorized('Session expired'));
        }
        else{
            req.tokenData = tokenData
            next()
        }
    });
}

module.exports = { isAuthenticated, isValidRefreshToken }