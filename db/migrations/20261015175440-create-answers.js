'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('answers', {
      answer_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      round_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'rounds', key: 'round_id' },
        onDelete: 'CASCADE',
      },
      session_player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'session_players', key: 'session_player_id' },
        onDelete: 'CASCADE',
      },
      choice_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'choices', key: 'choice_id' },
        onDelete: 'RESTRICT',
      },
      is_correct: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      damage_taken: { type: Sequelize.SMALLINT, allowNull: false, defaultValue: 0 },
      score_earned: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      answered_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.addConstraint('answers', {
      type: 'unique', name: 'uq_one_answer', fields: ['round_id', 'session_player_id'],
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE answers ADD CONSTRAINT ck_damage CHECK (damage_taken IN (0, 1, 2))"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE answers ADD CONSTRAINT ck_score_earned CHECK (score_earned >= 0)"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE answers ADD CONSTRAINT ck_answer_pair CHECK ((choice_id IS NULL) = (answered_at IS NULL))"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE answers ADD CONSTRAINT ck_correct_choice CHECK (NOT is_correct OR choice_id IS NOT NULL)"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE answers ADD CONSTRAINT ck_correct_safe CHECK (NOT is_correct OR damage_taken = 0)"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE answers ADD CONSTRAINT ck_score_correct CHECK (is_correct OR score_earned = 0)"
    );
    await queryInterface.addIndex('answers', ['session_player_id'], { name: 'idx_answers_player' });
    await queryInterface.addIndex('answers', ['choice_id'], { name: 'idx_answers_choice' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('answers');
  },
};