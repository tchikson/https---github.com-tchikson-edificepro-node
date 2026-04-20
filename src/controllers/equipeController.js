/**
 * Contrôleur pour la gestion des équipes.
 *
 * Gère les opérations CRUD (API JSON). Délègue la logique métier à EquipeService.
 */
const { Equipe, EquipeUser, User, Affectation, Chantier } = require('../models');
const equipeService = require('../services/equipeService');

/**
 * GET / — Liste toutes les équipes.
 */
async function index(req, res) {
  const equipes = await Equipe.findAll({
    include: [
      { model: User, as: 'chefEquipe' },
      { model: EquipeUser, as: 'equipeUsers' },
    ],
  });
  res.json(equipes);
}

/**
 * POST / — Crée une équipe.
 */
async function create(req, res) {
  try {
    const { nomEquipe, chefEquipeId, dateDebut, dateFin, membres } = req.body;
    const memberList = membres ? (Array.isArray(membres) ? membres : [membres]) : [];
    const parsedMembers = memberList.map((userId) => parseInt(userId, 10));

    for (const userId of parsedMembers) {
      const conflict = await equipeService.findConflictingAssignment(userId, dateDebut, dateFin);
      if (conflict) {
        return res.status(409).json({
          error: `L'utilisateur est déjà affecté à une autre équipe sur cette période.`,
        });
      }
    }

    const equipe = await equipeService.createEquipe(
      {
        nomEquipe,
        chefEquipeId: chefEquipeId || null,
        dateDebut,
        dateFin,
      },
      parsedMembers,
    );

    res.status(201).json(equipe);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Erreur lors de la création.' });
  }
}

/**
 * GET /:id — Affiche une équipe.
 */
async function show(req, res) {
  const equipe = await Equipe.findByPk(req.params.id, {
    include: [
      { model: User, as: 'chefEquipe' },
      {
        model: EquipeUser,
        as: 'equipeUsers',
        include: [{ model: User, as: 'utilisateur' }],
      },
      {
        model: Affectation,
        as: 'affectations',
        include: [{ model: Chantier, as: 'chantier' }],
      },
    ],
  });
  if (!equipe) {
    return res.status(404).json({ error: 'Équipe non trouvée.' });
  }
  res.json(equipe);
}

/**
 * PUT /:id — Met à jour une équipe.
 */
async function update(req, res) {
  try {
    const equipe = await Equipe.findByPk(req.params.id);
    if (!equipe) {
      return res.status(404).json({ error: 'Équipe non trouvée.' });
    }
    const { nomEquipe, chefEquipeId, dateDebut, dateFin, membres } = req.body;
    await equipe.update({
      nomEquipe,
      chefEquipeId: chefEquipeId || null,
      dateDebut,
      dateFin,
    });

    if (membres) {
      const memberList = Array.isArray(membres) ? membres : [membres];
      const members = memberList.map((userId) => ({
        utilisateurId: parseInt(userId, 10),
        dateDebut,
        dateFin,
      }));

      for (const member of members) {
        const conflict = await equipeService.findConflictingAssignment(
          member.utilisateurId,
          dateDebut,
          dateFin,
          equipe.id,
        );
        if (conflict) {
          return res.status(409).json({
            error: `L'utilisateur est déjà affecté à une autre équipe sur cette période.`,
          });
        }
      }

      await equipeService.updateEquipeMembers(equipe, members);
    } else {
      await EquipeUser.destroy({ where: { equipeId: equipe.id } });
    }

    res.json(equipe);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Erreur lors de la mise à jour.' });
  }
}

/**
 * DELETE /:id — Supprime une équipe.
 */
async function remove(req, res) {
  try {
    const equipe = await Equipe.findByPk(req.params.id);
    if (!equipe) {
      return res.status(404).json({ error: 'Équipe non trouvée.' });
    }
    await equipeService.deleteEquipe(equipe);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
}

module.exports = { index, create, show, update, remove };
