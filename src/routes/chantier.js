const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { verifyCsrfToken } = require('../middleware/csrf');
const chantierController = require('../controllers/chantierController');

router.get('/', isAuthenticated, chantierController.index);
router.post('/', isAuthenticated, isAdmin, verifyCsrfToken, chantierController.create);
router.get('/:id', isAuthenticated, chantierController.show);
router.put('/:id', isAuthenticated, isAdmin, verifyCsrfToken, chantierController.update);
router.delete('/:id', isAuthenticated, isAdmin, verifyCsrfToken, chantierController.remove);

module.exports = router;
