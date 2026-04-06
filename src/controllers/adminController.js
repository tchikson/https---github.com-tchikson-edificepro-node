/**
 * Contrôleur d'administration (API JSON).
 *
 * Tableau de bord administrateur (ROLE_ADMIN uniquement).
 */

/**
 * GET /admin — Tableau de bord admin.
 */
function index(req, res) {
  res.json({ message: 'Administration' });
}

module.exports = { index };
