const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');


//create a sequelize model for user
const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        field : 'id'
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue : 1
    },
    created_at: {
        type: DataTypes.DATE
    },
    updated_at: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;