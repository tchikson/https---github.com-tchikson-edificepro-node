/**
 * Contrôleur d'administration.
 *
 * Affiche le tableau de bord administrateur (ROLE_ADMIN uniquement).
 */

/**
 * GET /admin — Tableau de bord admin.
 */
function index(req, res) {
  res.render('admin/index', {
    title: 'Administration',
  });
}

module.exports = { index };
