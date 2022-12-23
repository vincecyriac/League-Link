const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');


//create a sequelize model for tournament-teams
const TournamentTeams = sequelize.define('tournament_teams', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'teams', key: 'id' }
    },
    tournament_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'tournaments', key: 'id' }
    },
    match_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue : 0
    },
    win_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue : 0
    },
    draw_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue : 0
    },
    lose_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue : 0
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue : 0
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
    tableName: 'tournament_teams',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
    underscored: true
});

module.exports = Matches;