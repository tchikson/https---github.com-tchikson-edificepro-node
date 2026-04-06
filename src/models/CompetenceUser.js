/**
 * Modèle CompetenceUser — Table de liaison entre Compétence et User.
 *
 * Indique quelles compétences possède un utilisateur donné.
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CompetenceUser = sequelize.define(
    'CompetenceUser',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      utilisateurId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'utilisateur_id',
      },
      competenceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'competence_id',
      },
    },
    {
      tableName: 'competence_users',
      timestamps: true,
    },
  );

  CompetenceUser.associate = (models) => {
    CompetenceUser.belongsTo(models.User, {
      foreignKey: 'utilisateurId',
      as: 'utilisateur',
    });
    CompetenceUser.belongsTo(models.Competence, {
      foreignKey: 'competenceId',
      as: 'competence',
    });
  };

  return CompetenceUser;
};
