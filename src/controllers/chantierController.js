/**
 * Contrôleur pour la gestion des chantiers.
 *
 * Gère les opérations CRUD (API JSON). Délègue la logique métier au ChantierService.
 */
const { Chantier, Equipe, Affectation, CompetenceChantier, Competence } = require('../models');
const chantierService = require('../services/chantierService');

/**
 * GET / — Liste tous les chantiers.
 */
async function index(req, res) {
  const chantiers = await Chantier.findAll({
    include: [
      {
        model: Affectation,
        as: 'affectations',
        include: [{ model: Equipe, as: 'equipe' }],
      },
      {
        model: CompetenceChantier,
        as: 'competenceChantiers',
        include: [{ model: Competence, as: 'competence' }],
      },
    ],
  });
  res.json(chantiers);
}

/**
 * POST / — Crée un chantier.
 */
async function create(req, res) {
  try {
    const { lieu, dateDebut, dateFin, status, competences, equipes } = req.body;

    const chantier = await chantierService.createChantier({
      lieu,
      dateDebut,
      dateFin,
      status,
    });

    if (competences) {
      const compIds = Array.isArray(competences) ? competences : [competences];
      for (const compId of compIds) {
        await CompetenceChantier.create({
          chantierId: chantier.id,
          competenceId: parseInt(compId, 10),
        });
      }
    }

    if (equipes) {
      const eqIds = Array.isArray(equipes) ? equipes : [equipes];
      for (const eqId of eqIds) {
        const overlap = await chantierService.hasDateOverlap(
          parseInt(eqId, 10),
          dateDebut,
          dateFin,
        );
        if (overlap) {
          return res.status(409).json({
            error: 'Une équipe a déjà un chantier sur cette période.',
          });
        }
        await Affectation.create({
          equipeId: parseInt(eqId, 10),
          chantierId: chantier.id,
          dateDebut,
          dateFin,
        });
      }
    }

    res.status(201).json(chantier);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Erreur lors de la création du chantier.' });
  }
}

/**
 * GET /:id — Affiche un chantier.
 */
async function show(req, res) {
  const chantier = await Chantier.findByPk(req.params.id, {
    include: [
      {
        model: CompetenceChantier,
        as: 'competenceChantiers',
        include: [{ model: Competence, as: 'competence' }],
      },
      {
        model: Affectation,
        as: 'affectations',
        include: [{ model: Equipe, as: 'equipe' }],
      },
    ],
  });
  if (!chantier) {
    return res.status(404).json({ error: 'Chantier non trouvé.' });
  }
  res.json(chantier);
}

/**
 * PUT /:id — Met à jour un chantier.
 */
async function update(req, res) {
  try {
    const chantier = await Chantier.findByPk(req.params.id);
    if (!chantier) {
      return res.status(404).json({ error: 'Chantier non trouvé.' });
    }
    const { lieu, dateDebut, dateFin, status, competences, equipes } = req.body;
    await chantierService.updateChantier(chantier, {
      lieu,
      dateDebut,
      dateFin,
      status,
    });

    await CompetenceChantier.destroy({ where: { chantierId: chantier.id } });
    if (competences) {
      const compIds = Array.isArray(competences) ? competences : [competences];
      for (const compId of compIds) {
        await CompetenceChantier.create({
          chantierId: chantier.id,
          competenceId: parseInt(compId, 10),
        });
      }
    }

    await Affectation.destroy({ where: { chantierId: chantier.id } });
    if (equipes) {
      const eqIds = Array.isArray(equipes) ? equipes : [equipes];
      for (const eqId of eqIds) {
        const overlap = await chantierService.hasDateOverlap(
          parseInt(eqId, 10),
          dateDebut,
          dateFin,
          chantier.id,
        );
        if (overlap) {
          return res.status(409).json({
            error: 'Une équipe a déjà un chantier sur cette période.',
          });
        }
        await Affectation.create({
          equipeId: parseInt(eqId, 10),
          chantierId: chantier.id,
          dateDebut,
          dateFin,
        });
      }
    }

    res.json(chantier);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Erreur lors de la mise à jour.' });
  }
}

/**
 * DELETE /:id — Supprime un chantier.
 */
async function remove(req, res) {
  try {
    const chantier = await Chantier.findByPk(req.params.id);
    if (!chantier) {
      return res.status(404).json({ error: 'Chantier non trouvé.' });
    }
    await chantierService.deleteChantier(chantier);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
}

module.exports = { index, create, show, update, remove };
