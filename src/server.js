/**
 * Démarrage du serveur Express.
 *
 * Synchronise la base Sequelize puis lance le serveur HTTP.
 */
require("dotenv").config();

const app = require("./app");
const db = require("./models");
const { logger } = require("./config/logger");

const PORT = process.env.APP_PORT || 3000;

(async () => {
  try {
    await db.sequelize.authenticate();
    logger.info("Connexion à la base de données établie.");

    // Synchronisation (en dev uniquement ; utiliser les migrations en prod)
    if (process.env.APP_ENV === "development") {
      await db.sequelize.sync({ alter: true });
      logger.info("Modèles synchronisés (alter: true).");
    }

    app.listen(PORT, "0.0.0.0", () => {
      logger.info(
        `Serveur démarré sur le port ${PORT} [${process.env.APP_ENV}]`,
      );
    });
  } catch (err) {
    logger.error("Impossible de démarrer le serveur :", err);
    process.exit(1);
  }
})();
