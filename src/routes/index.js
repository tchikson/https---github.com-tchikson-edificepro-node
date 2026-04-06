/**
 * Routeur principal — monte tous les sous-routeurs.
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

router.use('/', securityRoutes);
router.use('/admin', adminRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/chantier', chantierRoutes);
router.use('/equipe', equipeRoutes);
router.use('/competence', competenceRoutes);
router.use('/user', userRoutes);
router.use('/', legalRoutes);

module.exports = router;
