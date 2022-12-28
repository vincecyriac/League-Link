const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new Sequelize instance with the database connection details
const sequelize = new Sequelize({
    dialect: 'mysql',
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PSWD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
});

// Test the database connection
try {
    sequelize.authenticate();
    console.log('Database connection established');
} catch (error) {
    console.error('Unable to connect to db ', error);
}

// Export the sequelize instance for use in other parts of the application
module.exports = sequelize;
