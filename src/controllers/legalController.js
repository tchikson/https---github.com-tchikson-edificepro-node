/**
 * Contrôleur pour les pages légales (API JSON).
 */

/**
 * GET /mentions-legales
 */
function mentionsLegales(req, res) {
  res.json({ page: 'mentions-legales' });
}

module.exports = { mentionsLegales };
