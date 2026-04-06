const express = require('express');
const router = express.Router();
const { verifyCsrfToken } = require('../middleware/csrf');
const securityController = require('../controllers/securityController');

router.get('/me', securityController.me);
router.post('/login', verifyCsrfToken, securityController.login);
router.post('/logout', securityController.logout);

module.exports = router;
