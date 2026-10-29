'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define(
  'Player',
  {
    session_player_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    session_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    nickname: { type: DataTypes.STRING(20), allowNull: false },
    hp: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 5 },
    score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    is_eliminated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    is_winner: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    joined_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'session_players',
    timestamps: false,
  },
);