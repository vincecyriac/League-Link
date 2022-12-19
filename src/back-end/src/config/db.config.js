const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config()
//connecting to a db
const sequelize = new Sequelize({
    dialect: 'mysql',
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PSWD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

//testing connection
try {
    sequelize.authenticate();
    console.log('Database connection established')
} catch (error) {
    console.error('Unable to connect to db ', error);
}

module.exports = sequelize;