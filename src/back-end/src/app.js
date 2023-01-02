const express = require('express');
const loginRouter = require('./routes/login.routes');
const userRouter = require('./routes/users.routes');
const teamsRouter = require('./routes/teams.routes');
const playersRouter = require('./routes/players.routes');
const app = require('./server');
const cors = require('cors');
const dotenv = require('dotenv');

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

// Use the teams router for all teams-related routes
app.use('/players', playersRouter);

// Catch-all route to handle requests to routes that don't exist
app.get('*', function(req, res) {
  res.status(400).send({ message: "Path not found" });
});

// Export the app module
module.exports = app;

