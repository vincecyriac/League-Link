const express = require('express');
const handleErrors = require('./middlewares/handle-errors.middleware');
const loginRouter = require('./routes/login.routes');
const userRouter = require('./routes/users.routes');
const teamsRouter = require('./routes/teams.routes');
const app = require('./server');
const cors = require('cors');
const dotenv = require('dotenv');
const { NotFound } = require('./utils/errors.utils');

// Load environment variables from .env file
dotenv.config();

const { ORIGIN } = process.env;

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
  origin: ORIGIN,
}));

// Use the login router for all login-related routes
app.use('/login', loginRouter);

// Use the user router for all user-related routes
app.use('/user', userRouter);

// Use the teams router for all teams-related routes
app.use('/teams', teamsRouter);

// Catch-all route to handle requests to routes that don't exist
app.get('*', function(req, res, next) {
  next(new NotFound('Route not found'));
});

// Use the handleErrors middleware to handle any errors thrown in the preceding routes
app.use(handleErrors);

// Export the app module
module.exports = app;

