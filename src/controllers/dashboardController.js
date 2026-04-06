/**
 * Contrôleur du tableau de bord (API JSON).
 *
 * Renvoie les chantiers selon le rôle :
 * - Admin : tous les chantiers.
 * - Utilisateur : uniquement ses chantiers via ses équipes.
 */
const { Chantier, Affectation, Equipe, EquipeUser } = require('../models');

/**
 * GET /dashboard — Données du tableau de bord.
 */
async function index(req, res) {
  try {
    const user = req.user;
    let chantiers;

    if (user.hasRole('ROLE_ADMIN')) {
      chantiers = await Chantier.findAll({
        include: [
          {
            model: Affectation,
            as: 'affectations',
            include: [{ model: Equipe, as: 'equipe' }],
          },
        ],
      });
    } else {
      const equipeUsers = await EquipeUser.findAll({
        where: { utilisateurId: user.id },
        attributes: ['equipeId'],
      });
      const equipeIds = equipeUsers.map((eu) => eu.equipeId);

      const affectations = await Affectation.findAll({
        where: { equipeId: equipeIds },
        attributes: ['chantierId'],
      });
      const chantierIds = [...new Set(affectations.map((a) => a.chantierId))];

      chantiers = await Chantier.findAll({
        where: { id: chantierIds },
        include: [
          {
            model: Affectation,
            as: 'affectations',
            include: [{ model: Equipe, as: 'equipe' }],
          },
        ],
      });
    }

    res.json({
      chantiers,
      isAdmin: user.hasRole('ROLE_ADMIN'),
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du chargement du tableau de bord.' });
  }
}

module.exports = { index };
