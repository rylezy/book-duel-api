'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session_players', {
      session_player_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sessions', key: 'session_id' },
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'RESTRICT',
      },
      nickname: { type: Sequelize.STRING(20), allowNull: false },
      hp: { type: Sequelize.SMALLINT, allowNull: false, defaultValue: 5 },
      score: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      is_eliminated: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is_winner: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      joined_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    // one seat per account per game: the rejoin rule
    await queryInterface.addConstraint('session_players', {
      type: 'unique', name: 'uq_one_seat', fields: ['session_id', 'user_id'],
    });
    await queryInterface.addConstraint('session_players', {
      type: 'unique', name: 'uq_player_nickname', fields: ['session_id', 'nickname'],
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE session_players ADD CONSTRAINT ck_player_nickname CHECK (char_length(nickname) >= 2)"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE session_players ADD CONSTRAINT ck_player_hp CHECK (hp BETWEEN 0 AND 5)"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE session_players ADD CONSTRAINT ck_player_score CHECK (score >= 0)"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE session_players ADD CONSTRAINT ck_eliminated_hp CHECK (is_eliminated = (hp = 0))"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE session_players ADD CONSTRAINT ck_winner_alive CHECK (NOT (is_winner AND is_eliminated))"
    );
    await queryInterface.addIndex('session_players', ['user_id'], { name: 'idx_players_user' });
    await queryInterface.sequelize.query(
      'CREATE INDEX idx_players_leaderboard ON session_players (session_id, hp DESC, score DESC)'
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('session_players');
  },
};