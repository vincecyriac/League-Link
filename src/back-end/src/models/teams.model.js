const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');


//create a sequelize model for teams
const Teams = sequelize.define('teams', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    tournament_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'tournaments', key: 'id' }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
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
    tableName: 'teams',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
    underscored: true
});

module.exports = Teams;