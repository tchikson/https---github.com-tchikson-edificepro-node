/**
 * Contrôleur pour la gestion des chantiers.
 *
 * Gère les opérations CRUD. Délègue la logique métier au ChantierService.
 */
const {
  Chantier,
  Equipe,
  Affectation,
  CompetenceChantier,
  Competence,
} = require("../models");
const chantierService = require("../services/chantierService");

/**
 * GET /chantier — Liste tous les chantiers.
 */
async function index(req, res) {
  const chantiers = await Chantier.findAll({
    include: [
      {
        model: Affectation,
        as: "affectations",
        include: [{ model: Equipe, as: "equipe" }],
      },
    ],
  });
  res.render("chantier/index", { title: "Chantiers", chantiers });
}

/**
 * GET /chantier/new — Formulaire de création.
 */
async function newForm(req, res) {
  const equipes = await Equipe.findAll();
  const competences = await Competence.findAll();
  res.render("chantier/new", {
    title: "Nouveau chantier",
    equipes,
    competences,
    chantier: {},
  });
}

/**
 * POST /chantier — Crée un chantier.
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

    // Ajouter les compétences requises
    if (competences) {
      const compIds = Array.isArray(competences) ? competences : [competences];
      for (const compId of compIds) {
        await CompetenceChantier.create({
          chantierId: chantier.id,
          competenceId: parseInt(compId, 10),
        });
      }
    }

    // Affecter les équipes sélectionnées
    if (equipes) {
      const eqIds = Array.isArray(equipes) ? equipes : [equipes];
      for (const eqId of eqIds) {
        const overlap = await chantierService.hasDateOverlap(
          parseInt(eqId, 10),
          dateDebut,
          dateFin,
        );
        if (overlap) {
          req.flash(
            "error",
            "Une équipe a déjà un chantier sur cette période.",
          );
          return res.redirect("/chantier/new");
        }
        await Affectation.create({
          equipeId: parseInt(eqId, 10),
          chantierId: chantier.id,
          dateDebut,
          dateFin,
        });
      }
    }

    req.flash("success", "Chantier créé avec succès.");
    res.redirect("/chantier");
  } catch (err) {
    req.flash(
      "error",
      err.message || "Erreur lors de la création du chantier.",
    );
    res.redirect("/chantier/new");
  }
}

/**
 * GET /chantier/:id — Affiche un chantier.
 */
async function show(req, res) {
  const chantier = await Chantier.findByPk(req.params.id, {
    include: [
      {
        model: CompetenceChantier,
        as: "competenceChantiers",
        include: [{ model: Competence, as: "competence" }],
      },
      {
        model: Affectation,
        as: "affectations",
        include: [{ model: Equipe, as: "equipe" }],
      },
    ],
  });
  if (!chantier) {
    return res.status(404).render("errors/404", { title: "Non trouvé" });
  }
  res.render("chantier/show", {
    title: `Chantier — ${chantier.lieu}`,
    chantier,
  });
}

/**
 * GET /chantier/:id/edit — Formulaire d'édition.
 */
async function editForm(req, res) {
  const chantier = await Chantier.findByPk(req.params.id, {
    include: [
      { model: CompetenceChantier, as: "competenceChantiers" },
      { model: Affectation, as: "affectations" },
    ],
  });
  if (!chantier) {
    return res.status(404).render("errors/404", { title: "Non trouvé" });
  }
  const equipes = await Equipe.findAll();
  const competences = await Competence.findAll();
  const selectedCompetences = chantier.competenceChantiers.map(
    (cc) => cc.competenceId,
  );
  const selectedEquipes = chantier.affectations.map((a) => a.equipeId);
  res.render("chantier/edit", {
    title: "Modifier le chantier",
    chantier,
    equipes,
    competences,
    selectedCompetences,
    selectedEquipes,
  });
}

/**
 * POST /chantier/:id/edit — Met à jour un chantier.
 */
async function update(req, res) {
  try {
    const chantier = await Chantier.findByPk(req.params.id);
    if (!chantier) {
      return res.status(404).render("errors/404", { title: "Non trouvé" });
    }
    const { lieu, dateDebut, dateFin, status, competences, equipes } = req.body;
    await chantierService.updateChantier(chantier, {
      lieu,
      dateDebut,
      dateFin,
      status,
    });

    // Mettre à jour les compétences requises
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

    // Mettre à jour les affectations d'équipes
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
          req.flash(
            "error",
            "Une équipe a déjà un chantier sur cette période.",
          );
          return res.redirect(`/chantier/${chantier.id}/edit`);
        }
        await Affectation.create({
          equipeId: parseInt(eqId, 10),
          chantierId: chantier.id,
          dateDebut,
          dateFin,
        });
      }
    }

    req.flash("success", "Chantier mis à jour.");
    res.redirect("/chantier");
  } catch (err) {
    req.flash("error", err.message || "Erreur lors de la mise à jour.");
    res.redirect(`/chantier/${req.params.id}/edit`);
  }
}

/**
 * POST /chantier/:id/delete — Supprime un chantier.
 */
async function remove(req, res) {
  try {
    const chantier = await Chantier.findByPk(req.params.id);
    if (!chantier) {
      return res.status(404).render("errors/404", { title: "Non trouvé" });
    }
    await chantierService.deleteChantier(chantier);
    req.flash("success", "Chantier supprimé.");
  } catch (err) {
    req.flash("error", "Erreur lors de la suppression.");
  }
  res.redirect("/chantier");
}

module.exports = { index, newForm, create, show, editForm, update, remove };
