/**
 * Modèle User — Représente un utilisateur de l'application.
 *
 * Implémente l'authentification avec Passport.js.
 * Les rôles sont stockés en JSON (ROLE_USER, ROLE_ADMIN).
 * Un utilisateur peut posséder des compétences, être chef d'équipe et être membre d'équipes.
 */
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      prenom: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      roles: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: ['ROLE_USER'],
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
    },
  );

  User.associate = (models) => {
    User.hasMany(models.CompetenceUser, {
      foreignKey: 'utilisateurId',
      as: 'competenceUsers',
    });
    User.hasMany(models.Equipe, { foreignKey: 'chefEquipeId', as: 'equipes' });
    User.hasMany(models.EquipeUser, {
      foreignKey: 'utilisateurId',
      as: 'equipeUsers',
    });
  };

  /**
   * Vérifie si l'utilisateur possède le rôle donné.
   * @param {string} role
   * @returns {boolean}
   */
  User.prototype.hasRole = function (role) {
    return this.roles && this.roles.includes(role);
  };

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return User;
};
