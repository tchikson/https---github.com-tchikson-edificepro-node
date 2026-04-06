const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { verifyCsrfToken } = require('../middleware/csrf');
const competenceController = require('../controllers/competenceController');

router.get('/', isAuthenticated, isAdmin, competenceController.index);
router.get('/new', isAuthenticated, isAdmin, competenceController.newForm);
router.post(
  '/',
  isAuthenticated,
  isAdmin,
  verifyCsrfToken,
  competenceController.create,
);
router.get('/:id', isAuthenticated, isAdmin, competenceController.show);
router.get(
  '/:id/edit',
  isAuthenticated,
  isAdmin,
  competenceController.editForm,
);
router.post(
  '/:id/edit',
  isAuthenticated,
  isAdmin,
  verifyCsrfToken,
  competenceController.update,
);
router.post(
  '/:id/delete',
  isAuthenticated,
  isAdmin,
  verifyCsrfToken,
  competenceController.remove,
);

module.exports = router;
