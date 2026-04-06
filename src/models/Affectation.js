/**
 * Modèle Affectation — Représente l'affectation d'une équipe à un chantier.
 *
 * Fait le lien entre une Equipe et un Chantier avec des dates de début et de fin.
 */
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Affectation = sequelize.define(
    "Affectation",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      equipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "equipe_id",
      },
      chantierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "chantier_id",
      },
      dateDebut: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "date_debut",
      },
      dateFin: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "date_fin",
      },
    },
    {
      tableName: "affectations",
      timestamps: true,
    },
  );

  Affectation.associate = (models) => {
    Affectation.belongsTo(models.Equipe, {
      foreignKey: "equipeId",
      as: "equipe",
    });
    Affectation.belongsTo(models.Chantier, {
      foreignKey: "chantierId",
      as: "chantier",
    });
  };

  return Affectation;
};
