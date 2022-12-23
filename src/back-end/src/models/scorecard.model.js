const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');


//create a sequelize model for scorecard
const Scorecard = sequelize.define('scorecard', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    match_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'matches', key: 'id' }
    },
    player_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'players', key: 'id' }
    },
    runs: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wickets: {
        type: DataTypes.INTEGER,
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
    tableName: 'scorecard',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
    underscored: true
});

module.exports = Scorecard;