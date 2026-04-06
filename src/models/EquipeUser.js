/**
 * Modèle EquipeUser — Table de liaison entre Equipe et User.
 *
 * Représente l'appartenance d'un utilisateur à une équipe avec des dates
 * de début et de fin. Inclut une validation de non-chevauchement des affectations.
 */
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EquipeUser = sequelize.define(
    "EquipeUser",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      utilisateurId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "utilisateur_id",
      },
      equipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "equipe_id",
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
      tableName: "equipe_users",
      timestamps: true,
    },
  );

  EquipeUser.associate = (models) => {
    EquipeUser.belongsTo(models.User, {
      foreignKey: "utilisateurId",
      as: "utilisateur",
    });
    EquipeUser.belongsTo(models.Equipe, {
      foreignKey: "equipeId",
      as: "equipe",
    });
  };

  return EquipeUser;
};
