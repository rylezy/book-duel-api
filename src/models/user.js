// Model = the JavaScript view of ONE table.
// Column rules live in the migration;
// the model tells Sequelize how to read and write the table.

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'User',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      school_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'PLAYER',
      },

      // Week 12: Store the hashed password.
      password_hash: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,

      // Week 12: Exclude password_hash from normal queries.
      defaultScope: {
        attributes: {
          exclude: ['password_hash'],
        },
      },

      // Week 12: Allow login queries to retrieve password_hash.
      scopes: {
        withPassword: {
          attributes: {
            include: ['password_hash'],
          },
        },
      },
    }
  );