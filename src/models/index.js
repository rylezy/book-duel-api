const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const Session = require('./session')(sequelize, DataTypes);

module.exports = {
  sequelize,
  Sequelize,
  DataTypes,
  Session,
};
