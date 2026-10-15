'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('choices', {
      choice_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'questions', key: 'question_id' },
        onDelete: 'CASCADE',
      },
      text: { type: Sequelize.STRING(120), allowNull: false },
      position: { type: Sequelize.SMALLINT, allowNull: false },
      is_correct: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    });

    await queryInterface.sequelize.query(
      "ALTER TABLE choices ADD CONSTRAINT ck_choice_text CHECK (char_length(text) >= 1)"
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE choices ADD CONSTRAINT ck_choice_pos CHECK ("position" BETWEEN 0 AND 3)'
    );
    await queryInterface.addConstraint('choices', {
      type: 'unique', name: 'uq_choice_position', fields: ['question_id', 'position'],
    });
    await queryInterface.addIndex('choices', ['question_id'], {
      name: 'uq_one_correct_choice',
      unique: true,
      where: { is_correct: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('choices');
  },
};