const userService = require("../services/users.service");
const { BadRequest } = require("../utils/errors.utils"); // Import custom error class

// Function to create a new user
const createUser = async (req, res, next) => {
  try {
    // Call the createUser function in the userService module within the transaction
    userService.createUser(req.body)
      .then((userResponse) => {
        res.send({ message: 'user created', id: userResponse.id });
      })
      .catch((error) => {
        next(error);
      });
    return;
  } catch (error) {
    // return bad request
    throw new BadRequest("error", 500);
  }
};


module.exports = { createUser };
