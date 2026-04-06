const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { verifyCsrfToken } = require('../middleware/csrf');
const equipeController = require('../controllers/equipeController');

router.get('/', isAuthenticated, equipeController.index);
router.get('/new', isAuthenticated, isAdmin, equipeController.newForm);
router.post(
  '/',
  isAuthenticated,
  isAdmin,
  verifyCsrfToken,
  equipeController.create,
);
router.get('/:id', isAuthenticated, equipeController.show);
router.get('/:id/edit', isAuthenticated, isAdmin, equipeController.editForm);
router.post(
  '/:id/edit',
  isAuthenticated,
  isAdmin,
  verifyCsrfToken,
  equipeController.update,
);
router.post(
  '/:id/delete',
  isAuthenticated,
  isAdmin,
  verifyCsrfToken,
  equipeController.remove,
);

module.exports = router;
