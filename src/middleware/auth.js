/**
 * Middleware d'authentification et d'autorisation.
 *
 * isAuthenticated — Vérifie que l'utilisateur est connecté.
 * isAdmin — Vérifie que l'utilisateur possède ROLE_ADMIN.
 */

/**
 * Redirige vers /login si l'utilisateur n'est pas authentifié.
 */
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Vous devez être connecté pour accéder à cette page.');
  return res.redirect('/login');
}

/**
 * Renvoie 403 si l'utilisateur n'a pas le rôle ROLE_ADMIN.
 */
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.hasRole('ROLE_ADMIN')) {
    return next();
  }
  return res.status(403).render('errors/403', {
    title: 'Accès interdit',
  });
}

module.exports = { isAuthenticated, isAdmin };
