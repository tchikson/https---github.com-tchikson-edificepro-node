/**
 * Middleware SecurityHeaders — Headers HTTP de sécurité (OWASP).
 *
 * Ajoute les headers recommandés sur chaque réponse :
 * X-Content-Type-Options, X-Frame-Options, X-XSS-Protection,
 * Referrer-Policy, Permissions-Policy, Content-Security-Policy.
 * HSTS uniquement en production.
 */
function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  );
  res.setHeader(
    'Content-Security-Policy',
    'default-src \'self\'; ' +
      'script-src \'self\' \'unsafe-inline\' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://code.jquery.com; ' +
      'style-src \'self\' \'unsafe-inline\' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com; ' +
      'img-src \'self\' data: https://www.argusdelassurance.com; ' +
      'font-src \'self\' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.gstatic.com;',
  );

  if (process.env.APP_ENV === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
    );
  }

  next();
}

module.exports = securityHeaders;
