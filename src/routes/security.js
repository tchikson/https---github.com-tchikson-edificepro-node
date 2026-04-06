const express = require('express');
const router = express.Router();
const { verifyCsrfToken } = require('../middleware/csrf');
const securityController = require('../controllers/securityController');

router.get('/login', securityController.loginForm);
router.post('/login', verifyCsrfToken, securityController.login);
router.get('/logout', securityController.logout);

module.exports = router;
