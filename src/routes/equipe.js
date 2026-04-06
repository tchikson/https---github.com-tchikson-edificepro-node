const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { verifyCsrfToken } = require('../middleware/csrf');
const equipeController = require('../controllers/equipeController');

router.get('/', isAuthenticated, equipeController.index);
router.post('/', isAuthenticated, isAdmin, verifyCsrfToken, equipeController.create);
router.get('/:id', isAuthenticated, equipeController.show);
router.put('/:id', isAuthenticated, isAdmin, verifyCsrfToken, equipeController.update);
router.delete('/:id', isAuthenticated, isAdmin, verifyCsrfToken, equipeController.remove);

module.exports = router;
