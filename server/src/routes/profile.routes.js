const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profile.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const profileController = new ProfileController();

// Protect all profile routes
router.use(auth);

// Profile routes
router.get('/', profileController.show);
router.put('/', profileController.update);
router.delete('/', profileController.delete);

module.exports = router; 