const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

//create a sequelize model for tournaments
const Tournaments = sequelize.define('tournaments', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        field: 'id'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    number_of_teams: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image_url: {
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
    tableName: 'tournaments',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
    underscored: true
});

module.exports = Tournaments;