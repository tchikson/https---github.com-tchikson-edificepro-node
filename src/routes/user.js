const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { verifyCsrfToken } = require('../middleware/csrf');
const userController = require('../controllers/userController');

router.get('/profile', isAuthenticated, userController.profile);
router.put('/profile', isAuthenticated, verifyCsrfToken, userController.updateProfile);
router.get('/', isAuthenticated, isAdmin, userController.list);
router.post('/', isAuthenticated, isAdmin, verifyCsrfToken, userController.create);
router.get('/:id', isAuthenticated, isAdmin, userController.show);
router.put('/:id', isAuthenticated, isAdmin, verifyCsrfToken, userController.update);
router.delete('/:id', isAuthenticated, isAdmin, verifyCsrfToken, userController.remove);

module.exports = router;
