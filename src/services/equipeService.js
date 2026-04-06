/**
 * EquipeService — Couche métier pour la gestion des équipes.
 *
 * Encapsule la logique métier : détection des conflits d'affectation,
 * gestion des membres, et opérations CRUD.
 */
const { Op } = require('sequelize');
const { Equipe, EquipeUser, Affectation } = require('../models');
const { logger } = require('../config/logger');

/**
 * Recherche une affectation conflictuelle pour un utilisateur sur une période donnée.
 * @param {number} utilisateurId
 * @param {Date} dateDebut
 * @param {Date} dateFin
 * @param {number|null} excludeEquipeId - Équipe à exclure (édition)
 * @returns {Promise<object|null>} L'affectation conflictuelle ou null
 */
async function findConflictingAssignment(
  utilisateurId,
  dateDebut,
  dateFin,
  excludeEquipeId = null,
) {
  const where = {
    utilisateurId,
    dateDebut: { [Op.lt]: dateFin },
    dateFin: { [Op.gt]: dateDebut },
  };
  if (excludeEquipeId) {
    where.equipeId = { [Op.ne]: excludeEquipeId };
  }
  return EquipeUser.findOne({
    where,
    include: [{ model: Equipe, as: 'equipe' }],
  });
}

/**
 * Crée une nouvelle équipe.
 * @param {object} data - { nomEquipe, chefEquipeId, dateDebut, dateFin }
 * @returns {Promise<object>}
 */
async function createEquipe(data, memberIds = []) {
  try {
    const equipe = await Equipe.create(data);
    for (const userId of memberIds) {
      await EquipeUser.create({
        equipeId: equipe.id,
        utilisateurId: userId,
        dateDebut: data.dateDebut,
        dateFin: data.dateFin,
      });
    }
    logger.info(`Équipe créée : ${equipe.id}`);
    return equipe;
  } catch (err) {
    logger.error('Erreur création équipe', { error: err.message });
    throw err;
  }
}

/**
 * Met à jour les membres d'une équipe.
 * @param {object} equipe - Instance Equipe
 * @param {Array<object>} members - [{ utilisateurId, dateDebut, dateFin }]
 */
async function updateEquipeMembers(equipe, members) {
  try {
    await EquipeUser.destroy({ where: { equipeId: equipe.id } });
    for (const member of members) {
      await EquipeUser.create({
        equipeId: equipe.id,
        utilisateurId: member.utilisateurId,
        dateDebut: member.dateDebut,
        dateFin: member.dateFin,
      });
    }
    logger.info(`Membres de l'équipe ${equipe.id} mis à jour`);
  } catch (err) {
    logger.error('Erreur mise à jour membres équipe', { error: err.message });
    throw err;
  }
}

/**
 * Supprime une équipe et ses relations.
 * @param {object} equipe - Instance Equipe
 */
async function deleteEquipe(equipeOrId) {
  try {
    const equipe =
      typeof equipeOrId === 'object'
        ? equipeOrId
        : await Equipe.findByPk(equipeOrId);
    await EquipeUser.destroy({ where: { equipeId: equipe.id } });
    await Affectation.destroy({ where: { equipeId: equipe.id } });
    await equipe.destroy();
    logger.info(`Équipe supprimée : ${equipe.id}`);
  } catch (err) {
    logger.error('Erreur suppression équipe', { error: err.message });
    throw err;
  }
}

module.exports = {
  findConflictingAssignment,
  createEquipe,
  updateEquipeMembers,
  deleteEquipe,
};
