/**
 * Contrôleur de sécurité (authentification).
 *
 * Gère la connexion et la déconnexion des utilisateurs.
 */
const passport = require('passport');
const { logLoginSuccess, logLoginFailure, logLogout } = require('../middleware/securityLogger');

/**
 * GET /login — Affiche le formulaire de connexion.
 */
function loginForm(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/user');
  }
  res.render('security/login', {
    title: 'Connexion',
    lastEmail: '',
  });
}

/**
 * POST /login — Authentifie l'utilisateur.
 */
function login(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      logLoginFailure(req, info ? info.message : 'Identifiants invalides');
      req.flash('error', info ? info.message : 'Identifiants invalides.');
      return res.redirect('/login');
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      logLoginSuccess(req);
      if (user.hasRole('ROLE_ADMIN')) {
        return res.redirect('/admin');
      }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
}

/**
 * GET /logout — Déconnecte l'utilisateur.
 */
function logout(req, res) {
  logLogout(req);
  req.logout((err) => {
    if (err) return res.redirect('/');
    req.flash('success', 'Vous avez été déconnecté.');
    res.redirect('/login');
  });
}

module.exports = { loginForm, login, logout };
