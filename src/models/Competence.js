/**
 * Modèle Competence — Représente une compétence technique (ex: Maçonnerie, Électricité).
 *
 * Une compétence peut être attribuée à des utilisateurs (via CompetenceUser)
 * et requise par des chantiers (via CompetenceChantier).
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Competence = sequelize.define(
    'Competence',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nomCompetence: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'nom_competence',
      },
    },
    {
      tableName: 'competences',
      timestamps: true,
    },
  );

  Competence.associate = (models) => {
    Competence.hasMany(models.CompetenceUser, {
      foreignKey: 'competenceId',
      as: 'competenceUsers',
    });
    Competence.hasMany(models.CompetenceChantier, {
      foreignKey: 'competenceId',
      as: 'competenceChantiers',
    });
  };

  return Competence;
};
