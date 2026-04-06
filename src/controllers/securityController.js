/**
 * Contrôleur de sécurité (authentification).
 *
 * Gère la connexion et la déconnexion des utilisateurs (API JSON).
 */
const passport = require('passport');
const { logLoginSuccess, logLoginFailure, logLogout } = require('../middleware/securityLogger');

/**
 * POST /auth/login — Authentifie l'utilisateur.
 */
function login(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      logLoginFailure(req, info ? info.message : 'Identifiants invalides');
      return res.status(401).json({ error: info ? info.message : 'Identifiants invalides.' });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      logLoginSuccess(req);
      return res.json({
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          roles: user.roles,
        },
      });
    });
  })(req, res, next);
}

/**
 * POST /auth/logout — Déconnecte l'utilisateur.
 */
function logout(req, res) {
  logLogout(req);
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la déconnexion.' });
    }
    return res.json({ ok: true });
  });
}

/**
 * GET /auth/me — Renvoie l'utilisateur connecté.
 */
function me(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ user: null });
  }
  const u = req.user;
  return res.json({
    user: {
      id: u.id,
      nom: u.nom,
      prenom: u.prenom,
      email: u.email,
      roles: u.roles,
    },
  });
}

module.exports = { login, logout, me };
