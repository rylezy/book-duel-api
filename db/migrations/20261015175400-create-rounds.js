'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rounds', {
      round_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sessions', key: 'session_id' },
        onDelete: 'CASCADE',
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'questions', key: 'question_id' },
        onDelete: 'RESTRICT',
      },
      round_no: { type: Sequelize.SMALLINT, allowNull: false },
      status: { type: Sequelize.STRING(6), allowNull: false, defaultValue: 'open' },
      is_voided: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      started_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      deadline_at: { type: Sequelize.DATE, allowNull: false },
      closed_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.addConstraint('rounds', {
      type: 'unique', name: 'uq_round_no', fields: ['session_id', 'round_no'],
    });
    await queryInterface.addConstraint('rounds', {
      type: 'unique', name: 'uq_round_question', fields: ['session_id', 'question_id'],
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE rounds ADD CONSTRAINT ck_round_no CHECK (round_no >= 1)"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE rounds ADD CONSTRAINT ck_round_status CHECK (status IN ('open', 'closed'))"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE rounds ADD CONSTRAINT ck_round_deadline CHECK (deadline_at > started_at)"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE rounds ADD CONSTRAINT ck_round_closed CHECK ((status = 'closed') = (closed_at IS NOT NULL))"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE rounds ADD CONSTRAINT ck_round_voided CHECK (NOT is_voided OR status = 'closed')"
    );
    await queryInterface.addIndex('rounds', ['session_id'], {
      name: 'uq_one_open_round',
      unique: true,
      where: { status: 'open' },
    });
    await queryInterface.addIndex('rounds', ['question_id'], { name: 'idx_rounds_question' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('rounds');
  },
};