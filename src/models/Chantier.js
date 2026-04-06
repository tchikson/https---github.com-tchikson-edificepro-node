/**
 * Modèle Chantier — Représente un chantier de construction.
 *
 * Un chantier possède un lieu, des dates de début/fin, un statut (en_cours, en_pause, termine),
 * des compétences requises (via CompetenceChantier) et des affectations d'équipes (via Affectation).
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Chantier = sequelize.define(
    'Chantier',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      lieu: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { notEmpty: { msg: 'Le lieu du chantier est obligatoire.' } },
      },
      dateDebut: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'date_debut',
      },
      dateFin: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'date_fin',
      },
      status: {
        type: DataTypes.ENUM('en_cours', 'en_pause', 'termine'),
        allowNull: false,
        defaultValue: 'en_cours',
      },
    },
    {
      tableName: 'chantiers',
      timestamps: true,
      validate: {
        dateFinAfterDebut() {
          if (
            this.dateFin &&
            this.dateDebut &&
            this.dateFin <= this.dateDebut
          ) {
            throw new Error(
              'La date de fin doit être postérieure à la date de début.',
            );
          }
        },
      },
    },
  );

  Chantier.associate = (models) => {
    Chantier.hasMany(models.CompetenceChantier, {
      foreignKey: 'chantierId',
      as: 'competenceChantiers',
      onDelete: 'CASCADE',
    });
    Chantier.hasMany(models.Affectation, {
      foreignKey: 'chantierId',
      as: 'affectations',
      onDelete: 'CASCADE',
    });
  };

  return Chantier;
};
