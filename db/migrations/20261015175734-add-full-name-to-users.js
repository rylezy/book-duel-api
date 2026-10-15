'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'full_name', {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.sequelize.query(
      'ALTER TABLE users ALTER COLUMN full_name DROP DEFAULT'
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE users ADD CONSTRAINT ck_user_full_name CHECK (char_length(full_name) >= 1)"
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE users DROP CONSTRAINT ck_user_full_name'
    );
    await queryInterface.removeColumn('users', 'full_name');
  },
};