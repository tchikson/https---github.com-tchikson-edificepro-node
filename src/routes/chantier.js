const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { verifyCsrfToken } = require('../middleware/csrf');
const chantierController = require('../controllers/chantierController');

router.get('/', isAuthenticated, chantierController.index);
router.get('/new', isAuthenticated, isAdmin, chantierController.newForm);
router.post(
  '/',
  isAuthenticated,
  isAdmin,
  verifyCsrfToken,
  chantierController.create,
);
router.get('/:id', isAuthenticated, chantierController.show);
router.get('/:id/edit', isAuthenticated, isAdmin, chantierController.editForm);
router.post(
  '/:id/edit',
  isAuthenticated,
  isAdmin,
  verifyCsrfToken,
  chantierController.update,
);
router.post(
  '/:id/delete',
  isAuthenticated,
  isAdmin,
  verifyCsrfToken,
  chantierController.remove,
);

module.exports = router;
