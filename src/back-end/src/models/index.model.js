const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const { getSignedUrl } = require('../utils/s3.utils');

//create a sequelize model for user
const User = sequelize.define('users', {
    id          : { type: DataTypes.INTEGER, autoIncrement: true, unique: true, primaryKey: true },
    name        : { type: DataTypes.STRING(50), allowNull: false },
    email       : { type: DataTypes.STRING(255), allowNull: false }, 
    password    : { type: DataTypes.STRING(255), allowNull: false },
    status      : { type: DataTypes.TINYINT, allowNull: false, defaultValue : 1 },
    created_at  : { type: DataTypes.DATE, allowNull: false },
    updated_at  : { type: DataTypes.DATE, allowNull: false }
}, {
    tableName       : 'users',
    createdAt       : 'created_at',
    updatedAt       : 'updated_at',
    freezeTableName : true,
    underscored     : true
});

//create a sequelize model for teams
const Teams = sequelize.define('teams', {
    id          : { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    user_id     : { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    name        : { type: DataTypes.STRING(50), allowNull: false },
    image_url   : { type: DataTypes.STRING(100), allowNull: false },
    manager     : { type: DataTypes.STRING(50), allowNull: false },
    status      : { type: DataTypes.TINYINT, allowNull: false, defaultValue : 1 },
    created_at  : { type: DataTypes.DATE, allowNull: false },
    updated_at  : { type: DataTypes.DATE, allowNull: false }
}, {
    tableName       : 'teams',
    createdAt       : 'created_at',
    updatedAt       : 'updated_at',
    freezeTableName : true,
    underscored     : true
});

//create a sequelize model for tournaments
const Tournaments = sequelize.define('tournaments', {
    id              : { type: DataTypes.INTEGER, autoIncrement: true, unique: true, primaryKey: true, field: 'id' },
    name            : { type: DataTypes.STRING(50), allowNull: false },
    user_id         : { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    start_date      : { type: DataTypes.DATEONLY, allowNull: false },
    end_date        : { type: DataTypes.DATEONLY, allowNull: false },
    number_of_teams : { type: DataTypes.INTEGER, allowNull: false },
    image_url       : { type: DataTypes.STRING(100), allowNull: false },
    status          : { type: DataTypes.TINYINT, allowNull: false, defaultValue : 1 },
    created_at      : { type: DataTypes.DATE, allowNull: false },
    updated_at      : { type: DataTypes.DATE, allowNull: false }
}, {
    tableName       : 'tournaments',
    createdAt       : 'created_at',
    updatedAt       : 'updated_at',
    freezeTableName : true,
    underscored     : true
});

//create a sequelize model for tournament-teams
const TournamentTeams = sequelize.define('tournament_teams', {
    id              : { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    team_id         : { type: DataTypes.INTEGER, allowNull: false, references: { model: 'teams', key: 'id' } },
    tournament_id   : { type: DataTypes.INTEGER, allowNull: false, references: { model: 'tournaments', key: 'id' } },
    pool            : { type: DataTypes.INTEGER, allowNull: false, defaultValue : 0 },
    match_count     : { type: DataTypes.INTEGER, allowNull: false, defaultValue : 0 },
    win_count       : { type: DataTypes.INTEGER, allowNull: false, defaultValue : 0 },
    draw_count      : { type: DataTypes.INTEGER, allowNull: false, defaultValue : 0 },
    lose_count      : { type: DataTypes.INTEGER, allowNull: false, defaultValue : 0 },
    points          : { type: DataTypes.INTEGER, allowNull: false, defaultValue : 0 },
    status          : { type: DataTypes.TINYINT, allowNull: false, defaultValue : 1 },
    created_at      : { type: DataTypes.DATE, allowNull: false },
    updated_at      : { type: DataTypes.DATE, allowNull: false }
}, {
    tableName: 'tournament_teams',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
    underscored: true
});

//create a sequelize model for matches
const Matches = sequelize.define('matches', {
    id              : { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    tournament_id   : { type: DataTypes.INTEGER, allowNull: false, references: { model: 'tournaments', key: 'id' } },
    match_type_id   : { type: DataTypes.INTEGER, allowNull: false, references: { model: 'match_types', key: 'id' } },
    team1_id        : { type: DataTypes.INTEGER, allowNull: false, references: { model: 'teams', key: 'id' } },
    team2_id        : { type: DataTypes.INTEGER, allowNull: false, references: { model: 'teams', key: 'id' } },
    time            : { type: DataTypes.DATE, allowNull: false },
    location        : { type: DataTypes.STRING(50), allowNull: false },
    winner_team_id  : { type: DataTypes.INTEGER, allowNull: true, references: { model: 'teams', key: 'id' } },
    status          : { type: DataTypes.TINYINT, allowNull: false, defaultValue : 1 },
    created_at      : { type: DataTypes.DATE, allowNull: false },
    updated_at      : { type: DataTypes.DATE, allowNull: false }
}, {
    tableName       : 'matches',
    createdAt       : 'created_at',
    updatedAt       : 'updated_at',
    freezeTableName : true,
    underscored     : true
});

//create a sequelize model for match types
const matchTypes = sequelize.define('match_types', {
    id              : { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    type            : { type: DataTypes.STRING(45), allowNull: false },
    created_at      : { type: DataTypes.DATE, allowNull: false },
    updated_at      : { type: DataTypes.DATE, allowNull: false }
}, {
    tableName: 'match_types',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
    underscored: true
});

//create a sequelize model for players
const Players = sequelize.define('players', {
    id          : { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    team_id     : { type: DataTypes.INTEGER, allowNull: true, references: { model: 'teams', key: 'id' } },
    name        : { type: DataTypes.STRING(50), allowNull: false },
    phone       : { type: DataTypes.STRING(13), allowNull: false },
    user_id     : { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    status      : { type: DataTypes.TINYINT, allowNull: false, defaultValue : 1 },
    created_at  : { type: DataTypes.DATE, allowNull: false },
    updated_at  : { type: DataTypes.DATE, allowNull: false }
}, {
    tableName       : 'players',
    createdAt       : 'created_at',
    updatedAt       : 'updated_at',
    freezeTableName : true,
    underscored     : true
});

//create a sequelize model for scorecard
const Scorecard = sequelize.define('scorecard', {
    id          : { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    match_id    : { type: DataTypes.INTEGER, allowNull: false, references: { model: 'matches', key: 'id' } },
    player_id   : { type: DataTypes.INTEGER, allowNull: false, references: { model: 'players', key: 'id' } },
    runs        : { type: DataTypes.INTEGER, allowNull: false, defaultValue : 0 },
    wickets     : { type: DataTypes.INTEGER, allowNull: false, defaultValue : 0 },
    status      : { type: DataTypes.TINYINT, allowNull: false, defaultValue : 1 },
    created_at  : { type: DataTypes.DATE, allowNull: false },
    updated_at  : { type: DataTypes.DATE, allowNull: false }
}, {
    tableName       : 'scorecard',
    createdAt       : 'created_at',
    updatedAt       : 'updated_at',
    freezeTableName : true,
    underscored     : true
});

//User table associations
User.hasMany(Tournaments, { foreignKey : 'user_id', as : 'tournaments'})
User.hasMany(Teams, { foreignKey : 'user_id', as : 'teams'})
User.hasMany(Players, { foreignKey : 'user_id', as : 'players'})

//Teams table associations
Teams.hasMany(Players, { foreignKey : 'team_id', as : 'players'})
Teams.belongsTo(User)
Teams.belongsToMany(Tournaments, { through: 'tournament_teams', foreignKey: 'team_id' });

//Tournament table associations
Tournaments.hasMany( Matches, {foreignKey : 'tournament_id', as : 'matches'})
Tournaments.belongsTo(User);
Tournaments.belongsToMany(Teams, { through: 'tournament_teams', foreignKey: 'tournament_id' });

//Matches table association
Matches.belongsTo(Tournaments);
Matches.belongsTo(Teams)
Matches.belongsTo(matchTypes)
Matches.hasMany(Scorecard, { foreignKey : 'match_id', as : 'scorecard'})

//matchTypes table associations
Scorecard.hasMany(Matches)

//Players table associations
Players.belongsTo(User)
Players.belongsTo(Teams, {as : 'team'})
Players.hasMany(Scorecard, { foreignKey : 'player_id', as : 'scorecard'})

//Scorecard table associations
Scorecard.belongsTo(Players);
Scorecard.belongsTo(Matches)

// Define a prototype method for the Teams model that returns a signed URL for the team's image
Teams.prototype.getSignedUrl = async function () {
    // Call the getSignedUrl function with the team's image URL as the argument
    const signedUrl = await getSignedUrl(this.getDataValue('image_url'));
    // Return the signed URL
    return signedUrl;
};

// Define a prototype method for the Tournaments model that returns a signed URL for the tournament's image
Tournaments.prototype.getSignedUrl = async function () {
    // Call the getSignedUrl function with the tournament's image URL as the argument
    const signedUrl = await getSignedUrl(this.getDataValue('image_url'));
    // Return the signed URL
    return signedUrl;
};
  

module.exports = {User, Teams, Tournaments, TournamentTeams, Matches, Players, Scorecard}

