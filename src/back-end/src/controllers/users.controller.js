const userService = require("../services/users.service");
const { BadRequestException } = require("../utils/errors.utils");

// Function to create a new user
const createUser = async (req, res, next) => {
  try {
    // Check if user with given email already exists
    const userExists = await userService.getUserByEmail(req.body.email);
    if (userExists) {
      // Return error response if email is already in use
      next(new BadRequestException("Email already exists"))
    }

    // Create new user
    const user = await userService.createUser(req.body);
    if (user instanceof Error)
      next(new BadRequestException("failed to create user, Please check yout input"))
    else
      // Return success response with user ID
      res.send({ message: "User created", id: user.id });
  } catch (error) {
    // return bad request
    global.logger.error(error.stack)
    next(new BadRequestException())
  }
};

module.exports = { createUser };
