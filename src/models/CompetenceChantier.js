/**
 * Modèle CompetenceChantier — Table de liaison entre Compétence et Chantier.
 *
 * Indique quelles compétences sont requises pour un chantier donné.
 */
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CompetenceChantier = sequelize.define(
    "CompetenceChantier",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      chantierId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "chantier_id",
      },
      competenceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "competence_id",
      },
    },
    {
      tableName: "competence_chantiers",
      timestamps: true,
    },
  );

  CompetenceChantier.associate = (models) => {
    CompetenceChantier.belongsTo(models.Chantier, {
      foreignKey: "chantierId",
      as: "chantier",
    });
    CompetenceChantier.belongsTo(models.Competence, {
      foreignKey: "competenceId",
      as: "competence",
    });
  };

  return CompetenceChantier;
};
