const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const User = require('./user')(sequelize, DataTypes);
const QuestionSet = require('./question-set')(sequelize, DataTypes);
const Session = require('./session')(sequelize, DataTypes);
const Player = require('./player')(sequelize, DataTypes);

User.hasMany(QuestionSet, { foreignKey: 'host_id' });
QuestionSet.belongsTo(User, { foreignKey: 'host_id', as: 'host' });

User.hasMany(Session, { foreignKey: 'host_id' });
Session.belongsTo(User, { foreignKey: 'host_id', as: 'host' });

QuestionSet.hasMany(Session, { foreignKey: 'question_set_id' });
Session.belongsTo(QuestionSet, { foreignKey: 'question_set_id' });

Session.hasMany(Player, { foreignKey: 'session_id' });
Player.belongsTo(Session, { foreignKey: 'session_id' });

User.hasMany(Player, { foreignKey: 'user_id' });
Player.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  User,
  QuestionSet,
  Session,
  Player,
};