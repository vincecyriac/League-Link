const userService = require('../services/users.service')
const { Unauthorized } = require("../utils/errors.utils");
const { verify } = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
    const accessToken = req.header('Authorization');
    if (!accessToken || !accessToken.startsWith('LEAGUE_LINK')) {
         next(new Unauthorized('You are not authorized'));
    } else {
        verify(accessToken.split(' ')[1], process.env.JWT_KEY, (error, tokenData) => {
            if (error) {
                next(new Unauthorized('Invalid Token'));
            }
            else{
                req.tokenData = tokenData
                next()
            }
        });
    }
}

module.exports = { isAuthenticated }