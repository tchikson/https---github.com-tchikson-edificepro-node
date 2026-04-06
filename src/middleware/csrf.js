/**
 * Middleware CSRF — Protection contre les attaques Cross-Site Request Forgery.
 *
 * Génère un token par session et le vérifie sur les requêtes POST/PUT/DELETE.
 */
const crypto = require('crypto');

/**
 * Génère un token CSRF et le stocke en session.
 */
function generateCsrfToken(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  next();
}

/**
 * Vérifie le token CSRF soumis dans le corps ou l'en-tête x-csrf-token.
 */
function verifyCsrfToken(req, res, next) {
  const submittedToken = req.body._csrf || req.headers['x-csrf-token'];
  const storedToken = req.session.csrfToken;

  const submittedBuf = Buffer.from(submittedToken || '', 'utf8');
  const storedBuf = Buffer.from(storedToken || '', 'utf8');

  if (
    !submittedToken ||
    !storedToken ||
    submittedBuf.length !== storedBuf.length ||
    !crypto.timingSafeEqual(submittedBuf, storedBuf)
  ) {
    return res.status(403).json({ error: 'Token CSRF invalide.' });
  }
  next();
}

module.exports = { generateCsrfToken, verifyCsrfToken };
