'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define(
  'QuestionSet',
  {
    question_set_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    host_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(80), allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: true },
    subject: { type: DataTypes.STRING(60), allowNull: true },
    grade_level: { type: DataTypes.STRING(30), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'question_sets',
    timestamps: false,
  },
);