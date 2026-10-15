'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      question_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'question_sets', key: 'question_set_id' },
        onDelete: 'CASCADE',
      },
      text: { type: Sequelize.TEXT, allowNull: false },
      type: { type: Sequelize.STRING(15), allowNull: false },
      time_limit_sec: { type: Sequelize.SMALLINT, allowNull: false, defaultValue: 20 },
      position: { type: Sequelize.SMALLINT, allowNull: false },
    });

    await queryInterface.sequelize.query(
      "ALTER TABLE questions ADD CONSTRAINT ck_question_text CHECK (char_length(text) >= 1)"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE questions ADD CONSTRAINT ck_question_type CHECK (type IN ('multiple_choice', 'true_false'))"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE questions ADD CONSTRAINT ck_question_time CHECK (time_limit_sec BETWEEN 5 AND 60)"
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE questions ADD CONSTRAINT ck_question_pos CHECK ("position" BETWEEN 1 AND 50)'
    );
    await queryInterface.addConstraint('questions', {
      type: 'unique', name: 'uq_question_position', fields: ['question_set_id', 'position'],
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  },
};