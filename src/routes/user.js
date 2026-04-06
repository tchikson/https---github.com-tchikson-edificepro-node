const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { verifyCsrfToken } = require('../middleware/csrf');
const userController = require('../controllers/userController');

router.get('/', isAuthenticated, userController.index);
router.get('/list', isAuthenticated, isAdmin, userController.list);
router.get('/edit-modal', isAuthenticated, userController.editModal);
router.post(
  '/edit-modal',
  isAuthenticated,
  verifyCsrfToken,
  userController.updateModal,
);
router.get('/new', isAuthenticated, isAdmin, userController.newForm);
router.post(
  '/',
  isAuthenticated,
  isAdmin,
  verifyCsrfToken,
  userController.create,
);
router.get('/:id', isAuthenticated, isAdmin, userController.show);
router.get('/:id/edit', isAuthenticated, isAdmin, userController.editForm);
router.post(
  '/:id/edit',
  isAuthenticated,
  isAdmin,
  verifyCsrfToken,
  userController.update,
);
router.post(
  '/:id/delete',
  isAuthenticated,
  isAdmin,
  verifyCsrfToken,
  userController.remove,
);

module.exports = router;
