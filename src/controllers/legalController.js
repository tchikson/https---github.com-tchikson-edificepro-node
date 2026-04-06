/**
 * Contrôleur pour les pages légales.
 */

/**
 * GET /mentions-legales
 */
function mentionsLegales(req, res) {
  res.render('legal/mentions-legales', { title: 'Mentions légales' });
}

module.exports = { mentionsLegales };
