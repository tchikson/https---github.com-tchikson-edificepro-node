/**
 * ChantierService — Couche métier pour la gestion des chantiers.
 *
 * Encapsule la logique métier : vérification des chevauchements de dates,
 * validation des compétences d'équipe, et opérations CRUD.
 */
const { Op } = require('sequelize');
const {
  Chantier,
  Affectation,
  EquipeUser,
  CompetenceChantier,
  CompetenceUser,
  User,
} = require('../models');
const { logger } = require('../config/logger');

/**
 * Vérifie si une équipe a un chevauchement de dates avec un chantier existant.
 * @param {number} equipeId
 * @param {Date} dateDebut
 * @param {Date} dateFin
 * @param {number|null} excludeChantierId - Chantier à exclure (édition)
 * @returns {Promise<boolean>}
 */
async function hasDateOverlap(equipeId, dateDebut, dateFin, excludeChantierId = null) {
  const where = {
    equipeId,
    dateDebut: { [Op.lt]: dateFin },
    dateFin: { [Op.gt]: dateDebut },
  };
  if (excludeChantierId) {
    where.chantierId = { [Op.ne]: excludeChantierId };
  }
  const overlap = await Affectation.findOne({ where });
  return !!overlap;
}

/**
 * Vérifie si les membres d'une équipe possèdent toutes les compétences requises par un chantier.
 * @param {object} equipe - Instance Equipe avec equipeUsers chargés
 * @param {number} chantierId
 * @returns {Promise<boolean>}
 */
async function equipeHasRequiredCompetences(equipe, chantierId) {
  const requiredCompetences = await CompetenceChantier.findAll({
    where: { chantierId },
    attributes: ['competenceId'],
  });

  if (requiredCompetences.length === 0) return true;

  const equipeUsers = await EquipeUser.findAll({
    where: { equipeId: equipe.id },
    include: [
      {
        model: User,
        as: 'utilisateur',
        include: [{ model: CompetenceUser, as: 'competenceUsers' }],
      },
    ],
  });

  const teamCompetenceIds = new Set();
  equipeUsers.forEach((eu) => {
    if (eu.utilisateur && eu.utilisateur.competenceUsers) {
      eu.utilisateur.competenceUsers.forEach((cu) => {
        teamCompetenceIds.add(cu.competenceId);
      });
    }
  });

  return requiredCompetences.every((rc) => teamCompetenceIds.has(rc.competenceId));
}

/**
 * Crée un nouveau chantier.
 * @param {object} data - { lieu, dateDebut, dateFin, status }
 * @returns {Promise<object>} Le chantier créé
 */
async function createChantier(data, competenceIds = []) {
  try {
    const chantier = await Chantier.create(data);
    for (const compId of competenceIds) {
      await CompetenceChantier.create({
        chantierId: chantier.id,
        competenceId: compId,
      });
    }
    logger.info(`Chantier créé : ${chantier.id}`);
    return chantier;
  } catch (err) {
    logger.error('Erreur création chantier', { error: err.message });
    throw err;
  }
}

/**
 * Met à jour un chantier existant.
 * @param {object} chantier - Instance Chantier
 * @param {object} data - Champs à modifier
 * @returns {Promise<object>}
 */
async function updateChantier(chantier, data) {
  try {
    await chantier.update(data);
    logger.info(`Chantier mis à jour : ${chantier.id}`);
    return chantier;
  } catch (err) {
    logger.error('Erreur mise à jour chantier', { error: err.message });
    throw err;
  }
}

/**
 * Supprime un chantier et ses relations (cascade).
 * @param {object} chantier - Instance Chantier
 */
async function deleteChantier(chantier) {
  try {
    await CompetenceChantier.destroy({ where: { chantierId: chantier.id } });
    await Affectation.destroy({ where: { chantierId: chantier.id } });
    await chantier.destroy();
    logger.info(`Chantier supprimé : ${chantier.id}`);
  } catch (err) {
    logger.error('Erreur suppression chantier', { error: err.message });
    throw err;
  }
}

module.exports = {
  hasDateOverlap,
  equipeHasRequiredCompetences,
  createChantier,
  updateChantier,
  deleteChantier,
};
