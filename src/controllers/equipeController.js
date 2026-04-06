/**
 * Contrôleur pour la gestion des équipes.
 *
 * Gère les opérations CRUD. Délègue la logique métier à EquipeService.
 */
const {
  Equipe,
  EquipeUser,
  User,
  Affectation,
  Chantier,
} = require("../models");
const equipeService = require("../services/equipeService");

/**
 * GET /equipe — Liste toutes les équipes.
 */
async function index(req, res) {
  const equipes = await Equipe.findAll({
    include: [
      { model: User, as: "chefEquipe" },
      { model: EquipeUser, as: "equipeUsers" },
    ],
  });
  res.render("equipe/index", { title: "Équipes", equipes });
}

/**
 * GET /equipe/new — Formulaire de création.
 */
async function newForm(req, res) {
  const users = await User.findAll();
  res.render("equipe/new", { title: "Nouvelle équipe", users, equipe: {} });
}

/**
 * POST /equipe — Crée une équipe.
 */
async function create(req, res) {
  try {
    const { nomEquipe, chefEquipeId, dateDebut, dateFin, membres } = req.body;
    const equipe = await equipeService.createEquipe({
      nomEquipe,
      chefEquipeId: chefEquipeId || null,
      dateDebut,
      dateFin,
    });

    // Ajouter les membres si fournis
    if (membres) {
      const memberList = Array.isArray(membres) ? membres : [membres];
      for (const userId of memberList) {
        const conflict = await equipeService.findConflictingAssignment(
          parseInt(userId, 10),
          dateDebut,
          dateFin,
        );
        if (conflict) {
          req.flash(
            "error",
            `L'utilisateur est déjà affecté à une autre équipe sur cette période.`,
          );
          return res.redirect("/equipe/new");
        }
        await EquipeUser.create({
          equipeId: equipe.id,
          utilisateurId: parseInt(userId, 10),
          dateDebut,
          dateFin,
        });
      }
    }

    req.flash("success", "Équipe créée avec succès.");
    res.redirect("/equipe");
  } catch (err) {
    req.flash("error", err.message || "Erreur lors de la création.");
    res.redirect("/equipe/new");
  }
}

/**
 * GET /equipe/:id — Affiche une équipe.
 */
async function show(req, res) {
  const equipe = await Equipe.findByPk(req.params.id, {
    include: [
      { model: User, as: "chefEquipe" },
      {
        model: EquipeUser,
        as: "equipeUsers",
        include: [{ model: User, as: "utilisateur" }],
      },
      {
        model: Affectation,
        as: "affectations",
        include: [{ model: Chantier, as: "chantier" }],
      },
    ],
  });
  if (!equipe) {
    return res.status(404).render("errors/404", { title: "Non trouvé" });
  }
  res.render("equipe/show", { title: `Équipe — ${equipe.nomEquipe}`, equipe });
}

/**
 * GET /equipe/:id/edit — Formulaire d'édition.
 */
async function editForm(req, res) {
  const equipe = await Equipe.findByPk(req.params.id, {
    include: [{ model: EquipeUser, as: "equipeUsers" }],
  });
  if (!equipe) {
    return res.status(404).render("errors/404", { title: "Non trouvé" });
  }
  const users = await User.findAll();
  const currentMembers = equipe.equipeUsers.map((eu) => eu.utilisateurId);
  res.render("equipe/edit", {
    title: "Modifier l'équipe",
    equipe,
    users,
    currentMembers,
  });
}

/**
 * POST /equipe/:id/edit — Met à jour une équipe.
 */
async function update(req, res) {
  try {
    const equipe = await Equipe.findByPk(req.params.id);
    if (!equipe) {
      return res.status(404).render("errors/404", { title: "Non trouvé" });
    }
    const { nomEquipe, chefEquipeId, dateDebut, dateFin, membres } = req.body;
    await equipe.update({
      nomEquipe,
      chefEquipeId: chefEquipeId || null,
      dateDebut,
      dateFin,
    });

    // Mettre à jour les membres
    if (membres) {
      const memberList = Array.isArray(membres) ? membres : [membres];
      const memberData = memberList.map((userId) => ({
        utilisateurId: parseInt(userId, 10),
        dateDebut,
        dateFin,
      }));
      await equipeService.updateEquipeMembers(equipe, memberData);
    } else {
      // Aucun membre sélectionné → supprimer tous les membres
      await EquipeUser.destroy({ where: { equipeId: equipe.id } });
    }

    req.flash("success", "Équipe mise à jour.");
    res.redirect("/equipe");
  } catch (err) {
    req.flash("error", err.message || "Erreur lors de la mise à jour.");
    res.redirect(`/equipe/${req.params.id}/edit`);
  }
}

/**
 * POST /equipe/:id/delete — Supprime une équipe.
 */
async function remove(req, res) {
  try {
    const equipe = await Equipe.findByPk(req.params.id);
    if (!equipe) {
      return res.status(404).render("errors/404", { title: "Non trouvé" });
    }
    await equipeService.deleteEquipe(equipe);
    req.flash("success", "Équipe supprimée.");
  } catch (err) {
    req.flash("error", "Erreur lors de la suppression.");
  }
  res.redirect("/equipe");
}

module.exports = { index, newForm, create, show, editForm, update, remove };
