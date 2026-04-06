/**
 * Configuration Sequelize pour sequelize-cli (migrations).
 *
 * Supporte les environnements : development, test, production.
 */
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'app',
    password: process.env.DB_PASSWORD || '!ChangeMe!',
    database: process.env.DB_NAME || 'app',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER || 'app',
    password: process.env.DB_PASSWORD || '!ChangeMe!',
    database: process.env.DB_NAME || 'app_test',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
};
