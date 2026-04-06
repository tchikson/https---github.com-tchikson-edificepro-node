/**
 * Setup de test — prépare l'environnement avant les tests.
 */
process.env.APP_ENV = "test";
process.env.APP_SECRET = "test-secret-key-for-jest";
process.env.DB_HOST = "127.0.0.1";
process.env.DB_PORT = "5432";
process.env.DB_NAME = "app_test";
process.env.DB_USER = "app";
process.env.DB_PASSWORD = "!ChangeMe!";
