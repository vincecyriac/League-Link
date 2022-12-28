const userService = require("../services/users.service");
const { compareSync } = require("bcrypt");
const { Forbidden, NotFound, BadRequest } = require('../utils/errors.utils');
const authUtils = require('../utils/auth.utils');

// Function to handle login request
const login = async (req, res, next) => {
    // Check if email is provided in request body
    if (!req.body.email) {
        throw new BadRequest("Email is required", 1001);
    }
    try {
        // Get user by email
        const userResponse = await userService.getUserByEmail(req.body.email);
        // Check if user exists
        if (!userResponse) {
            throw new Forbidden("Invalid credentials", 1000);
        }
        // Check if password is valid
        const isValidPassword = compareSync(req.body.password, userResponse.password);
        if (!isValidPassword) {
            throw new Forbidden("Invalid credentials", 1000);
        }
        // Check if user is active
        if (userResponse.status !== 1) {
            throw new Forbidden("User is inactive", 1000);
        }
        // Generate and send JWT token
        res.send(authUtils.generateToken(userResponse));
    } catch (error) {
        next(error);
    }
};

// Function to get current logged in user
const getCurrentUser = async (req, res, next) => {
    try {
        // Get user by id from JWT token
        const userResponse = await userService.getUserById(req.tokenData.id);
        // Check if user exists
        if (!userResponse) {
            throw new NotFound("Something wrong with logged in user");
        }
        res.send(userResponse);
    } catch (error) {
        // return bad request
        throw new BadRequest(error, 500);
    }
};

// Function to refresh JWT token
const refreshToken = async (req, res, next) => {
    try {
        // Get user by email from JWT token
        const userResponse = await userService.getUserByEmail(req.tokenData.email);
        // Check if user exists
        if (!userResponse) {
            throw new NotFound("Something wrong with logged in user");
        }
        // Check if user is active
        if (userResponse.status !== 1) {
            throw new Forbidden("User is inactive", 1000);
        }
        // Generate and send new JWT token
        res.send(authUtils.generateToken(userResponse));
    } catch (error) {
        // return bad request
        throw new BadRequest(error, 500);
    }
};

module.exports = { login, getCurrentUser, refreshToken };
