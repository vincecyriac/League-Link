const { User } = require('../models/index.model');
const { BadRequest } = require('../utils/errors.utils');
const { genSaltSync, hashSync } = require("bcrypt");

// Function to get a user by their id
const getUserById = async (userId) => {
    try {
        // Find user by primary key and exclude password from the returned attributes
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        return user;
    } catch (error) {
        // return bad request
        throw new BadRequest(error, 500);
    }
}

// Function to get a user by their email
const getUserByEmail = async (email) => {
    try {
        // Find user by email
        const user = await User.findOne({
            where: { email: email }
        });
        return user;
    } catch (error) {
        // return bad request
        throw new BadRequest(error, 500);
    }
}

// Function to create a new user
const createUser = async (userData) => {
    try {
        // Check if a user with the same email already exists
        const userExists = await User.findOne({
            where: { email: userData.email }
        });

        if (userExists) {
            throw new BadRequest("user already exists", 1001);
        }

        // Hash the password before saving the user
        userData.password = hashSync(userData.password, genSaltSync(10));

        // Create the user
        const user = await User.create(userData);
        return user;
    } catch (error) {
        // return bad request
        if(error.errorCode == 1001)
            throw new BadRequest("user already exists", 1001);
        else
            throw new BadRequest(error, 500);
    }
}

module.exports = { getUserById, createUser, getUserByEmail };
