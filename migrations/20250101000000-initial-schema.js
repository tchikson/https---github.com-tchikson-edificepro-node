'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Users
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nom: { type: Sequelize.STRING, allowNull: false },
      prenom: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      roles: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: ['ROLE_USER'],
      },
      password: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 2. Chantiers
    await queryInterface.createTable('chantiers', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      lieu: { type: Sequelize.STRING, allowNull: false },
      date_debut: { type: Sequelize.DATE, allowNull: false },
      date_fin: { type: Sequelize.DATE, allowNull: false },
      status: {
        type: Sequelize.ENUM('en_cours', 'en_pause', 'termine'),
        allowNull: false,
        defaultValue: 'en_cours',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 3. Competences
    await queryInterface.createTable('competences', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nom_competence: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 4. Equipes
    await queryInterface.createTable('equipes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nom_equipe: { type: Sequelize.STRING, allowNull: false },
      chef_equipe_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      date_debut: { type: Sequelize.DATE, allowNull: false },
      date_fin: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 5. Affectations
    await queryInterface.createTable('affectations', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      equipe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'equipes', key: 'id' },
        onDelete: 'CASCADE',
      },
      chantier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'chantiers', key: 'id' },
        onDelete: 'CASCADE',
      },
      date_debut: { type: Sequelize.DATE, allowNull: false },
      date_fin: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 6. CompetenceChantier (pivot)
    await queryInterface.createTable('competence_chantiers', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      chantier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'chantiers', key: 'id' },
        onDelete: 'CASCADE',
      },
      competence_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'competences', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 7. CompetenceUser (pivot)
    await queryInterface.createTable('competence_users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      utilisateur_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      competence_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'competences', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 8. EquipeUser (pivot)
    await queryInterface.createTable('equipe_users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      utilisateur_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      equipe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'equipes', key: 'id' },
        onDelete: 'CASCADE',
      },
      date_debut: { type: Sequelize.DATE, allowNull: false },
      date_fin: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Index
    await queryInterface.addIndex('affectations', ['equipe_id', 'chantier_id']);
    await queryInterface.addIndex('competence_chantiers', [
      'chantier_id',
      'competence_id',
    ]);
    await queryInterface.addIndex('competence_users', [
      'utilisateur_id',
      'competence_id',
    ]);
    await queryInterface.addIndex('equipe_users', [
      'utilisateur_id',
      'equipe_id',
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('equipe_users');
    await queryInterface.dropTable('competence_users');
    await queryInterface.dropTable('competence_chantiers');
    await queryInterface.dropTable('affectations');
    await queryInterface.dropTable('equipes');
    await queryInterface.dropTable('competences');
    await queryInterface.dropTable('chantiers');
    await queryInterface.dropTable('users');
  },
};
