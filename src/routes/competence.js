const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { verifyCsrfToken } = require('../middleware/csrf');
const competenceController = require('../controllers/competenceController');

router.get('/', isAuthenticated, isAdmin, competenceController.index);
router.post('/', isAuthenticated, isAdmin, verifyCsrfToken, competenceController.create);
router.get('/:id', isAuthenticated, isAdmin, competenceController.show);
router.put('/:id', isAuthenticated, isAdmin, verifyCsrfToken, competenceController.update);
router.delete('/:id', isAuthenticated, isAdmin, verifyCsrfToken, competenceController.remove);

module.exports = router;
