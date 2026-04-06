/**
 * Point d'entrée de l'application Express.
 *
 * Configure l'ensemble des middlewares, routes et gestionnaires d'erreurs.
 */
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
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

// --- Moteur de vues EJS ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/base');

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

// --- Flash messages ---
app.use(flash());

// --- Passport ---
app.use(passport.initialize());
app.use(passport.session());

// --- En-têtes de sécurité ---
app.use(securityHeaders);

// --- CSRF token generation (disponible sur toutes les pages) ---
app.use(generateCsrfToken);

// --- Variables locales globales pour les vues ---
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  res.locals.currentPath = req.path;
  next();
});

// --- Routes ---
app.use('/', routes);

// --- Redirection racine ---
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return req.user.hasRole('ROLE_ADMIN')
      ? res.redirect('/admin')
      : res.redirect('/dashboard');
  }
  res.redirect('/login');
});

// --- 404 ---
app.use((req, res) => {
  res.status(404).render('errors/404', { title: 'Page non trouvée' });
});

// --- Erreur serveur ---
app.use((err, req, res, _next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl}`);
  res
    .status(err.status || 500)
    .render('errors/500', { title: 'Erreur serveur' });
});

module.exports = app;
