const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Tournaments = require('../models/tournaments.model')


//create a sequelize model for user
const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue : 1
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName : true,
    underscored : true
});

module.exports = User;

User.hasMany(Tournaments, { foreignKey : 'id', as : 'tournaments'})