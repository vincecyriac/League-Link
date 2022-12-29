const userService = require("../services/users.service");

// Function to create a new user
const createUser = async (req, res, next) => {
  try {
    // Check if user with given email already exists
    const userExists = await userService.getUserByEmail(req.body.email);
    if (userExists) {
      // Return error response if email is already in use
      return res.status(400).send({ message: "Email already exists" });
    }

    // Create new user
    const user = await userService.createUser(req.body);
    if (user instanceof Error)
      return res.status(400).send({ message: "failed to create user", errors: user.errors.map(x => x.message) });
    else
      // Return success response with user ID
      res.send({ message: "User created", id: user.id });
  } catch (error) {
    console.log(error.stack)
    // Return error response
    res.status(400).send({ message: "Something went wrong", trace: process.env.APP_ENV !== "prod" ? error.stack : "Cannot trace the error, Please find the log" });
  }
};

module.exports = { createUser };
