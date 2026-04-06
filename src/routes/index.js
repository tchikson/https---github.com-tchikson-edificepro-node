/**
 * Routeur principal — monte tous les sous-routeurs (API JSON).
 */
const express = require('express');
const router = express.Router();

const securityRoutes = require('./security');
const adminRoutes = require('./admin');
const dashboardRoutes = require('./dashboard');
const chantierRoutes = require('./chantier');
const equipeRoutes = require('./equipe');
const competenceRoutes = require('./competence');
const userRoutes = require('./user');
const legalRoutes = require('./legal');

// Endpoint CSRF token
router.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.session.csrfToken });
});

router.use('/auth', securityRoutes);
router.use('/admin', adminRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/chantiers', chantierRoutes);
router.use('/equipes', equipeRoutes);
router.use('/competences', competenceRoutes);
router.use('/users', userRoutes);
router.use('/', legalRoutes);

module.exports = router;
