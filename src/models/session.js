'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define(
  'Session',
  {
    session_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    host_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question_set_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    join_code: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'waiting',
    },
    end_reason: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ended_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'sessions',
    timestamps: false,
  },
);
