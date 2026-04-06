/**
 * Middleware d'authentification et d'autorisation.
 *
 * isAuthenticated — Vérifie que l'utilisateur est connecté.
 * isAdmin — Vérifie que l'utilisateur possède ROLE_ADMIN.
 */

/**
 * Renvoie 401 JSON si l'utilisateur n'est pas authentifié.
 */
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Non authentifié.' });
}

/**
 * Renvoie 403 JSON si l'utilisateur n'a pas le rôle ROLE_ADMIN.
 */
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.hasRole('ROLE_ADMIN')) {
    return next();
  }
  return res.status(403).json({ error: 'Accès interdit.' });
}

module.exports = { isAuthenticated, isAdmin };
