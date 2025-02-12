const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { validateProfile, validatePassword } = require('../middleware/validators/profile.validator');

const profileController = new ProfileController();

// Profile routes
router.get('/', authMiddleware, profileController.getProfile.bind(profileController));
router.put('/', 
  authMiddleware,
  validateProfile,
  profileController.updateProfile.bind(profileController)
);
router.put('/email', authMiddleware, profileController.updateEmail.bind(profileController));
router.put('/password',
  authMiddleware,
  validatePassword,
  profileController.updatePassword.bind(profileController)
);
router.delete('/',
  authMiddleware,
  profileController.deleteAccount.bind(profileController)
);

module.exports = router; 