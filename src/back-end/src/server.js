const express = require('express');  // import the express module
const dotenv = require('dotenv');   // import the dotenv module

// load environment variables from .env file
dotenv.config();

const app = express();  // create an express app

// set the port for the app to listen on
// if the PORT environment variable is not set, default to 3000
const PORT = process.env.PORT || 3000;

// start the server and have it listen on the specified port
app.listen(PORT, () => {
    console.log(`Server started and running on port ${PORT}`)
});

// export the app for use in other modules
module.exports = app;