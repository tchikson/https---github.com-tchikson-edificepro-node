/**
 * Middleware SecurityLogger — Journalisation des événements de sécurité.
 *
 * Trace les connexions réussies, les échecs d'authentification et les déconnexions.
 */
const { securityLogger } = require('../config/logger');

/**
 * Logge une connexion réussie.
 */
function logLoginSuccess(req) {
  securityLogger.info('Connexion réussie', {
    email: req.user ? req.user.email : 'inconnu',
    ip: req.ip,
  });
}

/**
 * Logge un échec de connexion.
 */
function logLoginFailure(req, message) {
  securityLogger.warn('Échec de connexion', {
    email: req.body ? req.body.email : 'inconnu',
    ip: req.ip,
    reason: message,
  });
}

/**
 * Logge une déconnexion.
 */
function logLogout(req) {
  securityLogger.info('Déconnexion', {
    email: req.user ? req.user.email : 'inconnu',
    ip: req.ip,
  });
}

module.exports = { logLoginSuccess, logLoginFailure, logLogout };
