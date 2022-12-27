const { User, Teams, Tournaments } = require('../models/index.model');
const { BadRequest } = require('../utils/errors.utils');
const { genSaltSync, hashSync } = require("bcrypt");

const userById = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
    });
    return user;
}
const userByEmail = async (email) => {
    const user = await User.findOne({
        where: { email: email }
    })
    return user;
}
const creatUser = async (userData) => {
    userExists = await User.findOne({
        where: { email: userData.email }
    })
    if (userExists)
        throw new BadRequest("user already exists", 1001);
    userData.password = hashSync(userData.password, genSaltSync(10));
    const user = await User.create(userData);
    return user;
}
module.exports = { userById, creatUser, userByEmail }