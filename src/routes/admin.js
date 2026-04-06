const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const adminController = require("../controllers/adminController");

router.get("/", isAuthenticated, isAdmin, adminController.index);

module.exports = router;
