const express = require('express');
const loginRouter = require('./routes/login.routes');
const userRouter = require('./routes/users.routes');
const teamsRouter = require('./routes/teams.routes');
const playersRouter = require('./routes/players.routes');
const tournamentRouter = require('./routes/tournament.routes')
const app = require('./server');
const cors = require('cors');
const dotenv = require('dotenv');
const { logger, logAllRequests } = require('./utils/logger.utils');
const { isValidHeader } = require('./middlewares/validate.middleware');

// Load environment variables from .env file
dotenv.config();

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.use(isValidHeader);

// Log request details on each API request
app.use(logAllRequests);

// Use the login router for all login-related routes
app.use('/login', loginRouter);

// Use the user router for all user-related routes
app.use('/user', userRouter);

// Use the teams router for all teams-related routes
app.use('/teams', teamsRouter);

// Use the players router for all teams-related routes
app.use('/players', playersRouter);

// Use the tournaments router for all tournament-related routes
app.use('/tournaments', tournamentRouter);

// Catch-all route to handle requests to routes that don't exist
app.all('/*', function (req, res) {
  res.status(400).send({ message: "Path not found" });
});

global.logger = logger

// Export the app module
module.exports = app;

