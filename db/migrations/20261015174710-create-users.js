'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      school_id: { type: Sequelize.STRING(20), allowNull: false },
      username: { type: Sequelize.STRING(40), allowNull: false },
      email: { type: Sequelize.STRING(100), allowNull: false },
      password_hash: { type: Sequelize.STRING(60), allowNull: false },
      role: { type: Sequelize.STRING(10), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addConstraint('users', {
      type: 'unique', name: 'uq_user_school_id', fields: ['school_id'],
    });
    await queryInterface.addConstraint('users', {
      type: 'unique', name: 'uq_user_username', fields: ['username'],
    });
    await queryInterface.addConstraint('users', {
      type: 'unique', name: 'uq_user_email', fields: ['email'],
    });
    await queryInterface.sequelize.query(
      "ALTER TABLE users ADD CONSTRAINT ck_user_username CHECK (char_length(username) >= 3)"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE users ADD CONSTRAINT ck_user_role CHECK (role IN ('host', 'player'))"
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};