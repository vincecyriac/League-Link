const { User } = require('../models/index.model');
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
        return error
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
        return error
    }
}

// Function to create a new user
const createUser = async (userData) => {
    // Start a transaction
    const transaction = await sequelize.transaction();
    try {
        // Hash the password before saving the user
        userData.password = hashSync(userData.password, genSaltSync(10));

        // Create the user
        const user = await User.create(userData, { transaction });
        await transaction.commit();
        return user;
    } catch (error) {
        await transaction.rollback();
        global.logger.error(error.stack)
        return error
    }
}

module.exports = { getUserById, createUser, getUserByEmail };
