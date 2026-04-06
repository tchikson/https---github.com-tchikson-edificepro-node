/**
 * Seeder — Données de fixtures (identiques aux AppFixtures Symfony).
 *
 * 1 admin, 5 utilisateurs, 5 compétences, 2 équipes avec membres, 2 chantiers avec affectations.
 */
"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const hash = await bcrypt.hash("password", 10);
    const adminHash = await bcrypt.hash("admin123", 10);

    // --- Users ---
    await queryInterface.bulkInsert("users", [
      {
        id: 1,
        nom: "Admin",
        prenom: "Super",
        email: "admin@edificepro.fr",
        roles: JSON.stringify(["ROLE_ADMIN", "ROLE_USER"]),
        password: adminHash,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@edificepro.fr",
        roles: JSON.stringify(["ROLE_USER"]),
        password: hash,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        nom: "Martin",
        prenom: "Marie",
        email: "marie.martin@edificepro.fr",
        roles: JSON.stringify(["ROLE_USER"]),
        password: hash,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        nom: "Durand",
        prenom: "Pierre",
        email: "pierre.durand@edificepro.fr",
        roles: JSON.stringify(["ROLE_USER"]),
        password: hash,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 5,
        nom: "Leroy",
        prenom: "Sophie",
        email: "sophie.leroy@edificepro.fr",
        roles: JSON.stringify(["ROLE_USER"]),
        password: hash,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 6,
        nom: "Moreau",
        prenom: "Luc",
        email: "luc.moreau@edificepro.fr",
        roles: JSON.stringify(["ROLE_USER"]),
        password: hash,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- Competences ---
    await queryInterface.bulkInsert("competences", [
      { id: 1, nom_competence: "Maçonnerie", createdAt: now, updatedAt: now },
      { id: 2, nom_competence: "Électricité", createdAt: now, updatedAt: now },
      { id: 3, nom_competence: "Plomberie", createdAt: now, updatedAt: now },
      { id: 4, nom_competence: "Menuiserie", createdAt: now, updatedAt: now },
      { id: 5, nom_competence: "Peinture", createdAt: now, updatedAt: now },
    ]);

    // --- CompetenceUser ---
    await queryInterface.bulkInsert("competence_users", [
      { utilisateur_id: 2, competence_id: 1, createdAt: now, updatedAt: now },
      { utilisateur_id: 2, competence_id: 3, createdAt: now, updatedAt: now },
      { utilisateur_id: 3, competence_id: 2, createdAt: now, updatedAt: now },
      { utilisateur_id: 3, competence_id: 5, createdAt: now, updatedAt: now },
      { utilisateur_id: 4, competence_id: 1, createdAt: now, updatedAt: now },
      { utilisateur_id: 4, competence_id: 4, createdAt: now, updatedAt: now },
      { utilisateur_id: 5, competence_id: 3, createdAt: now, updatedAt: now },
      { utilisateur_id: 6, competence_id: 2, createdAt: now, updatedAt: now },
      { utilisateur_id: 6, competence_id: 4, createdAt: now, updatedAt: now },
    ]);

    // --- Equipes ---
    const d1 = new Date("2025-03-01");
    const d2 = new Date("2025-06-30");
    const d3 = new Date("2025-04-01");
    const d4 = new Date("2025-09-30");

    await queryInterface.bulkInsert("equipes", [
      {
        id: 1,
        nom_equipe: "Équipe Alpha",
        chef_equipe_id: 2,
        date_debut: d1,
        date_fin: d2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        nom_equipe: "Équipe Bêta",
        chef_equipe_id: 5,
        date_debut: d3,
        date_fin: d4,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- EquipeUser ---
    await queryInterface.bulkInsert("equipe_users", [
      {
        utilisateur_id: 2,
        equipe_id: 1,
        date_debut: d1,
        date_fin: d2,
        createdAt: now,
        updatedAt: now,
      },
      {
        utilisateur_id: 3,
        equipe_id: 1,
        date_debut: d1,
        date_fin: d2,
        createdAt: now,
        updatedAt: now,
      },
      {
        utilisateur_id: 4,
        equipe_id: 1,
        date_debut: d1,
        date_fin: d2,
        createdAt: now,
        updatedAt: now,
      },
      {
        utilisateur_id: 5,
        equipe_id: 2,
        date_debut: d3,
        date_fin: d4,
        createdAt: now,
        updatedAt: now,
      },
      {
        utilisateur_id: 6,
        equipe_id: 2,
        date_debut: d3,
        date_fin: d4,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- Chantiers ---
    await queryInterface.bulkInsert("chantiers", [
      {
        id: 1,
        lieu: "15 Rue de la Paix, Paris",
        date_debut: d1,
        date_fin: d2,
        status: "en_cours",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        lieu: "8 Avenue des Champs, Lyon",
        date_debut: d3,
        date_fin: d4,
        status: "en_cours",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- CompetenceChantier ---
    await queryInterface.bulkInsert("competence_chantiers", [
      { chantier_id: 1, competence_id: 1, createdAt: now, updatedAt: now },
      { chantier_id: 1, competence_id: 2, createdAt: now, updatedAt: now },
      { chantier_id: 1, competence_id: 3, createdAt: now, updatedAt: now },
      { chantier_id: 2, competence_id: 2, createdAt: now, updatedAt: now },
      { chantier_id: 2, competence_id: 4, createdAt: now, updatedAt: now },
    ]);

    // --- Affectations ---
    await queryInterface.bulkInsert("affectations", [
      {
        equipe_id: 1,
        chantier_id: 1,
        date_debut: d1,
        date_fin: d2,
        createdAt: now,
        updatedAt: now,
      },
      {
        equipe_id: 2,
        chantier_id: 2,
        date_debut: d3,
        date_fin: d4,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("affectations", null, {});
    await queryInterface.bulkDelete("competence_chantiers", null, {});
    await queryInterface.bulkDelete("equipe_users", null, {});
    await queryInterface.bulkDelete("competence_users", null, {});
    await queryInterface.bulkDelete("equipes", null, {});
    await queryInterface.bulkDelete("chantiers", null, {});
    await queryInterface.bulkDelete("competences", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};
