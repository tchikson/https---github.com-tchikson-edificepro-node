/**
 * Middleware CSRF — Protection contre les attaques Cross-Site Request Forgery.
 *
 * Génère un token par session et le vérifie sur les requêtes POST/PUT/DELETE.
 */
const crypto = require("crypto");

/**
 * Génère un token CSRF et le stocke en session.
 * Le rend disponible dans res.locals pour les templates.
 */
function generateCsrfToken(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }
  res.locals.csrfToken = function () {
    return req.session.csrfToken;
  };
  next();
}

/**
 * Vérifie le token CSRF soumis dans le corps de la requête (champ _csrf).
 */
function verifyCsrfToken(req, res, next) {
  const submittedToken = req.body._csrf;
  const storedToken = req.session.csrfToken;

  if (
    !submittedToken ||
    !storedToken ||
    !crypto.timingSafeEqual(
      Buffer.from(submittedToken, "utf8"),
      Buffer.from(storedToken, "utf8"),
    )
  ) {
    req.flash("error", "Token CSRF invalide.");
    return res.redirect("back");
  }
  next();
}

module.exports = { generateCsrfToken, verifyCsrfToken };
