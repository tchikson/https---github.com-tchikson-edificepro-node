/**
 * Modèle Equipe — Représente une équipe de travail.
 *
 * Une équipe possède un nom, un chef d'équipe (User), des membres (via EquipeUser)
 * et peut être affectée à des chantiers (via Affectation).
 */
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Equipe = sequelize.define(
    "Equipe",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nomEquipe: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "nom_equipe",
      },
      chefEquipeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "chef_equipe_id",
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
      tableName: "equipes",
      timestamps: true,
      validate: {
        dateFinAfterDebut() {
          if (
            this.dateFin &&
            this.dateDebut &&
            this.dateFin <= this.dateDebut
          ) {
            throw new Error(
              "La date de fin doit être postérieure à la date de début.",
            );
          }
        },
      },
    },
  );

  Equipe.associate = (models) => {
    Equipe.belongsTo(models.User, {
      foreignKey: "chefEquipeId",
      as: "chefEquipe",
    });
    Equipe.hasMany(models.EquipeUser, {
      foreignKey: "equipeId",
      as: "equipeUsers",
    });
    Equipe.hasMany(models.Affectation, {
      foreignKey: "equipeId",
      as: "affectations",
    });
  };

  return Equipe;
};
