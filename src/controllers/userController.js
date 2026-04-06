/**
 * Contrôleur pour la gestion des utilisateurs.
 *
 * CRUD utilisateurs : listing, création (avec génération de mot de passe),
 * affichage, édition, suppression.
 */
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {
  User,
  CompetenceUser,
  EquipeUser,
  Equipe,
  Competence,
} = require("../models");

/**
 * GET /user — Tableau de bord utilisateur.
 */
async function index(req, res) {
  const user = await User.findByPk(req.user.id, {
    include: [
      {
        model: CompetenceUser,
        as: "competenceUsers",
        include: [{ model: Competence, as: "competence" }],
      },
      {
        model: EquipeUser,
        as: "equipeUsers",
        include: [{ model: Equipe, as: "equipe" }],
      },
    ],
  });
  res.render("user/index", { title: "Mon espace", userProfile: user });
}

/**
 * GET /user/list — Liste tous les utilisateurs.
 */
async function list(req, res) {
  const users = await User.findAll({
    include: [
      {
        model: CompetenceUser,
        as: "competenceUsers",
        include: [{ model: Competence, as: "competence" }],
      },
    ],
  });
  res.render("user/list", { title: "Utilisateurs", users });
}

/**
 * GET /user/new — Formulaire de création.
 */
async function newForm(req, res) {
  const competences = await Competence.findAll();
  const randomPassword = crypto.randomBytes(8).toString("hex");
  res.render("user/new", {
    title: "Nouvel utilisateur",
    competences,
    randomPassword,
    user: {},
  });
}

/**
 * POST /user — Crée un utilisateur.
 */
async function create(req, res) {
  try {
    const { nom, prenom, email, password, roles, competences } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      req.flash("error", "Cet email est déjà utilisé.");
      return res.redirect("/user/new");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRoles = roles
      ? Array.isArray(roles)
        ? roles
        : [roles]
      : ["ROLE_USER"];

    const user = await User.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
      roles: userRoles,
    });

    // Ajouter les compétences
    if (competences) {
      const compIds = Array.isArray(competences) ? competences : [competences];
      for (const compId of compIds) {
        await CompetenceUser.create({
          utilisateurId: user.id,
          competenceId: parseInt(compId, 10),
        });
      }
    }

    req.flash("success", "Utilisateur créé.");
    res.redirect("/user/list");
  } catch (err) {
    req.flash("error", err.message || "Erreur lors de la création.");
    res.redirect("/user/new");
  }
}

/**
 * GET /user/:id — Affiche un utilisateur.
 */
async function show(req, res) {
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: CompetenceUser,
        as: "competenceUsers",
        include: [{ model: Competence, as: "competence" }],
      },
      {
        model: EquipeUser,
        as: "equipeUsers",
        include: [{ model: Equipe, as: "equipe" }],
      },
    ],
  });
  if (!user) {
    return res.status(404).render("errors/404", { title: "Non trouvé" });
  }
  res.render("user/show", {
    title: `${user.prenom} ${user.nom}`,
    userProfile: user,
  });
}

/**
 * GET /user/:id/edit — Formulaire d'édition.
 */
async function editForm(req, res) {
  const user = await User.findByPk(req.params.id, {
    include: [
      { model: CompetenceUser, as: "competenceUsers" },
      { model: EquipeUser, as: "equipeUsers" },
    ],
  });
  if (!user) {
    return res.status(404).render("errors/404", { title: "Non trouvé" });
  }
  const competences = await Competence.findAll();
  const isAssignedToEquipe = user.equipeUsers && user.equipeUsers.length > 0;
  res.render("user/edit", {
    title: "Modifier l'utilisateur",
    userProfile: user,
    competences,
    isAssignedToEquipe,
  });
}

/**
 * POST /user/:id/edit — Met à jour un utilisateur.
 */
async function update(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: CompetenceUser, as: "competenceUsers" },
        { model: EquipeUser, as: "equipeUsers" },
      ],
    });
    if (!user) {
      return res.status(404).render("errors/404", { title: "Non trouvé" });
    }

    const { nom, prenom, email, password, roles, competences } = req.body;
    await user.update({
      nom,
      prenom,
      email,
      roles: roles ? (Array.isArray(roles) ? roles : [roles]) : user.roles,
    });

    if (password) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    // Mettre à jour les compétences si non affecté à une équipe
    const isAssigned = user.equipeUsers && user.equipeUsers.length > 0;
    if (!isAssigned) {
      await CompetenceUser.destroy({ where: { utilisateurId: user.id } });
      if (competences) {
        const compIds = Array.isArray(competences)
          ? competences
          : [competences];
        for (const compId of compIds) {
          await CompetenceUser.create({
            utilisateurId: user.id,
            competenceId: parseInt(compId, 10),
          });
        }
      }
    }

    req.flash("success", "Utilisateur mis à jour.");
    res.redirect("/user/list");
  } catch (err) {
    req.flash("error", err.message || "Erreur lors de la mise à jour.");
    res.redirect(`/user/${req.params.id}/edit`);
  }
}

/**
 * POST /user/:id/delete — Supprime un utilisateur.
 */
async function remove(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.redirect("/user/list");
    }

    // Empêcher l'auto-suppression
    if (req.user.id === user.id) {
      req.flash("error", "Vous ne pouvez pas supprimer votre propre compte.");
      return res.redirect("/user/list");
    }

    // Empêcher la suppression d'un admin
    if (user.hasRole("ROLE_ADMIN")) {
      req.flash("error", "Vous ne pouvez pas supprimer un administrateur.");
      return res.redirect("/user/list");
    }

    // Supprimer les relations
    await CompetenceUser.destroy({ where: { utilisateurId: user.id } });
    await EquipeUser.destroy({ where: { utilisateurId: user.id } });

    // Détacher le chef d'équipe
    await Equipe.update(
      { chefEquipeId: null },
      { where: { chefEquipeId: user.id } },
    );

    await user.destroy();
    req.flash("success", "Utilisateur supprimé.");
  } catch (err) {
    req.flash("error", "Erreur lors de la suppression.");
  }
  res.redirect("/user/list");
}

/**
 * GET /user/edit-modal — Fragment HTML pour le modal de profil.
 */
function editModal(req, res) {
  res.render("user/edit_modal", { layout: false });
}

/**
 * POST /user/edit-modal — Met à jour le profil de l'utilisateur connecté.
 */
async function updateModal(req, res) {
  try {
    const user = await User.findByPk(req.user.id);
    const { nom, prenom, email, password } = req.body;
    await user.update({ nom, prenom, email });
    if (password) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }
    req.flash("success", "Profil mis à jour.");
  } catch (err) {
    req.flash("error", "Erreur lors de la mise à jour du profil.");
  }
  res.redirect("/dashboard");
}

module.exports = {
  index,
  list,
  newForm,
  create,
  show,
  editForm,
  update,
  remove,
  editModal,
  updateModal,
};
