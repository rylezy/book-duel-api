'use strict';

const password = require('../../src/security/password');

// Public password for local demo accounts only.
const DEMO_PASSWORD = 'BookDuel-Demo-2026';

// The placeholder used by your original seeder.
const LEGACY_HASH = '$2b$10$' + 'x'.repeat(53);

const DEMO_IDS = [
  '2099-0001',
  '2099-0002',
  '2099-1001',
  '2099-1002',
  '2099-1003',
  '2099-1004',
  '2099-1005',
];

module.exports = {
  async up(queryInterface) {
    const hash = await password.hash(DEMO_PASSWORD);

    await queryInterface.sequelize.transaction(async (transaction) => {
      // Update only the original demo accounts.
      // Preserve any password hash that was already properly assigned.
      await queryInterface.sequelize.query(
        `
        UPDATE users
        SET role = UPPER(role),
            password_hash = CASE
              WHEN password_hash IS NULL OR password_hash = :legacyHash
              THEN :hash
              ELSE password_hash
            END
        WHERE school_id IN (:ids);
        `,
        {
          replacements: {
            ids: DEMO_IDS,
            legacyHash: LEGACY_HASH,
            hash,
          },
          transaction,
        }
      );

      // Avoid inserting the demo administrator twice.
      const [existing] = await queryInterface.sequelize.query(
        'SELECT user_id FROM users WHERE school_id = :schoolId;',
        {
          replacements: { schoolId: '2099-9000' },
          transaction,
        }
      );

      if (existing.length === 0) {
        await queryInterface.bulkInsert(
          'users',
          [
            {
              school_id: '2099-9000',
              username: 'demo_admin',
              full_name: 'Demo Administrator',
              email: 'admin.demo@bookduel.test',
              role: 'ADMIN',
              password_hash: hash,
            },
          ],
          { transaction }
        );
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete(
        'users',
        {
          school_id: '2099-9000',
          username: 'demo_admin',
          email: 'admin.demo@bookduel.test',
        },
        { transaction }
      );

      // Restore the original demo-account values.
      await queryInterface.sequelize.query(
        `
        UPDATE users
        SET role = LOWER(role),
            password_hash = :legacyHash
        WHERE school_id IN (:ids);
        `,
        {
          replacements: {
            ids: DEMO_IDS,
            legacyHash: LEGACY_HASH,
          },
          transaction,
        }
      );
    });
  },
};