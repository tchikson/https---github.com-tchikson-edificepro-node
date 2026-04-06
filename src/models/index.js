/**
 * Initialisation et export de tous les modèles Sequelize.
 *
 * Charge chaque modèle, exécute les associations, et expose
 * l'instance sequelize ainsi que tous les modèles.
 */
const { Sequelize } = require('sequelize');
const path = require('path');

const env = process.env.APP_ENV || 'development';

// Charger .env.test en mode test, sinon .env
if (env === 'test') {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env.test') });
} else {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: env === 'development' ? console.log : false,
  },
);

const db = {};

// Charger chaque modèle
const modelFiles = [
  'User', 'Chantier', 'Equipe', 'Competence',
  'Affectation', 'CompetenceChantier', 'CompetenceUser', 'EquipeUser',
];

modelFiles.forEach((file) => {
  const model = require(path.join(__dirname, file))(sequelize);
  db[model.name] = model;
});

// Exécuter les associations
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
