/**
 * Contrôleur pour la gestion des compétences.
 *
 * CRUD compétences (API JSON) — réservé aux administrateurs.
 */
const { Competence } = require('../models');

/**
 * GET / — Liste les compétences.
 */
async function index(req, res) {
  const competences = await Competence.findAll();
  res.json(competences);
}

/**
 * POST / — Crée une compétence.
 */
async function create(req, res) {
  try {
    const { nomCompetence } = req.body;

    const existing = await Competence.findOne({ where: { nomCompetence } });
    if (existing) {
      return res.status(409).json({ error: 'Cette compétence existe déjà.' });
    }

    const competence = await Competence.create({ nomCompetence });
    res.status(201).json(competence);
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la création.' });
  }
}

/**
 * GET /:id — Affiche une compétence.
 */
async function show(req, res) {
  const competence = await Competence.findByPk(req.params.id);
  if (!competence) {
    return res.status(404).json({ error: 'Compétence non trouvée.' });
  }
  res.json(competence);
}

/**
 * PUT /:id — Met à jour une compétence.
 */
async function update(req, res) {
  try {
    const competence = await Competence.findByPk(req.params.id);
    if (!competence) {
      return res.status(404).json({ error: 'Compétence non trouvée.' });
    }

    const { nomCompetence } = req.body;
    const existing = await Competence.findOne({ where: { nomCompetence } });
    if (existing && existing.id !== competence.id) {
      return res.status(409).json({ error: 'Cette compétence existe déjà.' });
    }

    await competence.update({ nomCompetence });
    res.json(competence);
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour.' });
  }
}

/**
 * DELETE /:id — Supprime une compétence.
 */
async function remove(req, res) {
  try {
    const competence = await Competence.findByPk(req.params.id);
    if (!competence) {
      return res.status(404).json({ error: 'Compétence non trouvée.' });
    }
    await competence.destroy();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
}

module.exports = { index, create, show, update, remove };
