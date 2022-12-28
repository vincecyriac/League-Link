const userService = require('../services/users.service');
const { Unauthorized, BadRequest } = require("../utils/errors.utils");
const { verify } = require("jsonwebtoken");
const AWS = require('aws-sdk');

// Initialize the AWS S3 client with the provided access and secret keys
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

// Middleware function to check if the user is authenticated
const isAuthenticated = async (req, res, next) => {
    // Get the access token from the request header
    const accessToken = req.header('Authorization');

    // If the access token is not present or does not start with 'LEAGUE_LINK',
    // return an error indicating that the user is not authorized
    if (!accessToken || !accessToken.startsWith('LEAGUE_LINK')) {
        return next(new Unauthorized('You are not authorized'));
    }

    // Verify the access token
    try {
        // Split the access token into two parts: the prefix 'LEAGUE_LINK' and the actual token
        const token = accessToken.split(' ')[1];
        // Verify the token using the JWT key
        const tokenData = verify(token, process.env.JWT_KEY);

        // If the token is not of type 0, return an error indicating that the token is invalid
        if (tokenData.type !== 0) {
            return next(new Unauthorized('Invalid Token'));
        }

        // If the token is valid, attach the token data to the request object and call the next middleware
        req.tokenData = tokenData;
        next();
    } catch (error) {
        // If there was an error verifying the token, return an error indicating that the token is invalid
        return next(new Unauthorized('Invalid Token'));
    }
};

// Middleware function to check if the provided refresh token is valid
const isValidRefreshToken = async (req, res, next) => {
    try {
        // Verify the refresh token using the JWT key
        const tokenData = verify(req.body.refreshToken, process.env.JWT_KEY);

        // If the token is not of type 1, return an error indicating that the session has expired
        if (tokenData.type !== 1) {
            return next(new Unauthorized('Session expired'));
        }

        // If the token is valid, attach the token data to the request object and call the next middleware
        req.tokenData = tokenData;
        next();
    } catch (error) {
        // If there was an error verifying the token, return an error indicating that the session has expired
        return next(new Unauthorized('Session expired'));
    }
};

module.exports = { isAuthenticated, isValidRefreshToken };
