const userService = require("../services/users.service");
const { compareSync } = require("bcrypt");
const { Forbidden, NotFound } = require('../utils/errors.utils');
const authUtils = require('../utils/auth.utils')

const login = async (req, res, next) => {
    userService.userByEmail(req.body.email)
        .then((userResponse) => {
            if (userResponse) {
                isValidPassword = compareSync(req.body.password, userResponse.password);
                if (isValidPassword && userResponse.status == 1) {
                    res.send(authUtils.generateToken(userResponse));
                } else {
                    throw new Forbidden('Invalid credentials', 1000)
                }
            }
            else {
                throw new Forbidden('Invalid credentials', 1000)
            }
        })
        .catch((error) => {
            next(error);
        });
    return;
}

const getCurrentUser = async (req, res, next) => {
    userService.userById(req.tokenData.id)
        .then((userResponse) => {
            if (userResponse) {
                res.send(userResponse)
            }
            else {
                throw new NotFound('Something wrong with loggedin user')
            }
        })
        .catch((error) => {
            next(error);
        });
    return;
}

module.exports = { login, getCurrentUser }