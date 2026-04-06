/**
 * Point d'entrée de l'application Express.
 *
 * Configure l'ensemble des middlewares, routes API et le fallback SPA.
 */
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');

const securityHeaders = require('./middleware/securityHeaders');
const { generateCsrfToken } = require('./middleware/csrf');
const routes = require('./routes');
const { logger } = require('./config/logger');

// Charger la config passport
require('./config/passport');

const app = express();

// --- Trust proxy (derrière nginx) ---
app.set('trust proxy', 1);

// --- Fichiers statiques ---
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- Body parsers ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Logging HTTP ---
if (process.env.APP_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (msg) => logger.info(msg.trim()) },
    }),
  );
}

// --- Session ---
app.use(
  session({
    secret: process.env.APP_SECRET || 'change-me-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.APP_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2, // 2h
      sameSite: 'lax',
    },
  }),
);

// --- Passport ---
app.use(passport.initialize());
app.use(passport.session());

// --- En-têtes de sécurité ---
app.use(securityHeaders);

// --- CSRF token generation ---
app.use(generateCsrfToken);

// --- Routes API (JSON) ---
app.use('/api', routes);

// --- 404 API ---
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée.' });
});

// --- SPA fallback : renvoie index.html pour les routes Vue ---
const spaIndex = path.join(__dirname, '..', 'public', 'dist', 'index.html');
app.get('*', (req, res, next) => {
  res.sendFile(spaIndex, (err) => {
    if (err) next();
  });
});

// --- Erreur serveur ---
app.use((err, req, res, _next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl}`);
  res.status(err.status || 500).json({ error: 'Erreur serveur.' });
});

module.exports = app;
