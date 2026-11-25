'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        ALTER TABLE users DROP CONSTRAINT ck_user_role;

        ALTER TABLE users
          ALTER COLUMN username DROP NOT NULL,
          ALTER COLUMN email TYPE VARCHAR(255),
          ALTER COLUMN password_hash DROP NOT NULL,
          ALTER COLUMN role TYPE VARCHAR(20),
          ALTER COLUMN role SET DEFAULT 'PLAYER';

        ALTER TABLE users
          ADD CONSTRAINT ck_user_role
          CHECK (UPPER(role) IN ('PLAYER', 'HOST', 'ADMIN'));
        `,
        { transaction }
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        ALTER TABLE users DROP CONSTRAINT ck_user_role;

        UPDATE users SET role = LOWER(role);

        ALTER TABLE users
          ALTER COLUMN role DROP DEFAULT,
          ALTER COLUMN role TYPE VARCHAR(10),
          ALTER COLUMN password_hash SET NOT NULL,
          ALTER COLUMN email TYPE VARCHAR(100),
          ALTER COLUMN username SET NOT NULL;

        ALTER TABLE users
          ADD CONSTRAINT ck_user_role
          CHECK (role IN ('host', 'player'));
        `,
        { transaction }
      );
    });
  },
};