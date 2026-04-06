const express = require('express');
const router = express.Router();
const legalController = require('../controllers/legalController');

router.get('/mentions-legales', legalController.mentionsLegales);

module.exports = router;
