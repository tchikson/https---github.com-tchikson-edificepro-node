/**
 * Contrôleur du tableau de bord.
 *
 * Affiche les chantiers selon le rôle :
 * - Admin : tous les chantiers.
 * - Utilisateur : uniquement ses chantiers via ses équipes.
 */
const { Chantier, Affectation, Equipe, EquipeUser } = require("../models");

/**
 * GET /dashboard — Affiche le tableau de bord.
 */
async function index(req, res) {
  try {
    const user = req.user;
    let chantiers;

    if (user.hasRole("ROLE_ADMIN")) {
      chantiers = await Chantier.findAll({
        include: [
          {
            model: Affectation,
            as: "affectations",
            include: [{ model: Equipe, as: "equipe" }],
          },
        ],
      });
    } else {
      // Récupérer les chantiers liés aux équipes de l'utilisateur
      const equipeUsers = await EquipeUser.findAll({
        where: { utilisateurId: user.id },
        attributes: ["equipeId"],
      });
      const equipeIds = equipeUsers.map((eu) => eu.equipeId);

      const affectations = await Affectation.findAll({
        where: { equipeId: equipeIds },
        attributes: ["chantierId"],
      });
      const chantierIds = [...new Set(affectations.map((a) => a.chantierId))];

      chantiers = await Chantier.findAll({
        where: { id: chantierIds },
        include: [
          {
            model: Affectation,
            as: "affectations",
            include: [{ model: Equipe, as: "equipe" }],
          },
        ],
      });
    }

    res.render("dashboard/index", {
      title: "Tableau de bord",
      chantiers,
      user,
      isAdmin: user.hasRole("ROLE_ADMIN"),
    });
  } catch (err) {
    req.flash("error", "Erreur lors du chargement du tableau de bord.");
    res.redirect("/");
  }
}

module.exports = { index };
