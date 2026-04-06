/**
 * Contrôleur pour la gestion des compétences.
 *
 * CRUD compétences — réservé aux administrateurs.
 */
const { Competence } = require("../models");

/**
 * GET /competence — Liste les compétences.
 */
async function index(req, res) {
  const competences = await Competence.findAll();
  res.render("competence/index", { title: "Compétences", competences });
}

/**
 * GET /competence/new — Formulaire de création.
 */
function newForm(req, res) {
  res.render("competence/new", {
    title: "Nouvelle compétence",
    competence: {},
  });
}

/**
 * POST /competence — Crée une compétence.
 */
async function create(req, res) {
  try {
    const { nomCompetence } = req.body;

    const existing = await Competence.findOne({ where: { nomCompetence } });
    if (existing) {
      req.flash("error", "Cette compétence existe déjà.");
      return res.redirect("/competence/new");
    }

    await Competence.create({ nomCompetence });
    req.flash("success", "Compétence ajoutée avec succès.");
    res.redirect("/competence");
  } catch (err) {
    req.flash("error", "Erreur lors de la création.");
    res.redirect("/competence/new");
  }
}

/**
 * GET /competence/:id — Affiche une compétence.
 */
async function show(req, res) {
  const competence = await Competence.findByPk(req.params.id);
  if (!competence) {
    return res.status(404).render("errors/404", { title: "Non trouvé" });
  }
  res.render("competence/show", {
    title: competence.nomCompetence,
    competence,
  });
}

/**
 * GET /competence/:id/edit — Formulaire d'édition.
 */
async function editForm(req, res) {
  const competence = await Competence.findByPk(req.params.id);
  if (!competence) {
    return res.status(404).render("errors/404", { title: "Non trouvé" });
  }
  res.render("competence/edit", {
    title: "Modifier la compétence",
    competence,
  });
}

/**
 * POST /competence/:id/edit — Met à jour une compétence.
 */
async function update(req, res) {
  try {
    const competence = await Competence.findByPk(req.params.id);
    if (!competence) {
      return res.status(404).render("errors/404", { title: "Non trouvé" });
    }

    const { nomCompetence } = req.body;
    const existing = await Competence.findOne({ where: { nomCompetence } });
    if (existing && existing.id !== competence.id) {
      req.flash("error", "Cette compétence existe déjà.");
      return res.redirect(`/competence/${competence.id}/edit`);
    }

    await competence.update({ nomCompetence });
    req.flash("success", "Compétence mise à jour.");
    res.redirect("/competence");
  } catch (err) {
    req.flash("error", "Erreur lors de la mise à jour.");
    res.redirect(`/competence/${req.params.id}/edit`);
  }
}

/**
 * POST /competence/:id/delete — Supprime une compétence.
 */
async function remove(req, res) {
  try {
    const competence = await Competence.findByPk(req.params.id);
    if (competence) {
      await competence.destroy();
      req.flash("success", "Compétence supprimée.");
    }
  } catch (err) {
    req.flash("error", "Erreur lors de la suppression.");
  }
  res.redirect("/competence");
}

module.exports = { index, newForm, create, show, editForm, update, remove };
