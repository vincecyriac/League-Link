const userService = require("../services/users.service");

const createUser = async (req, res, next) => {
    userService.creatUser(req.body)
        .then((userResponse) => {
            res.send({message: 'user created', id : userResponse.user_id});
        })
        .catch((error) => {
            next(error);
        });
    return;
}


module.exports = { createUser };