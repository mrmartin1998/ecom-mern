const router = require('express').Router();
const profileController = require('../controllers/profile.controller');
const auth = require('../middleware/auth');
const { validateProfile, validateEmail, validatePassword } = require('../middleware/validators/profile.validator');
const validate = require('../middleware/validate');

// Protect all profile routes
router.use(auth);

// Profile routes
router.get('/', profileController.getProfile);
router.put('/', validateProfile, validate, profileController.updateProfile);
router.put('/email', validateEmail, validate, profileController.updateEmail);
router.put('/password', validatePassword, validate, profileController.updatePassword);
router.delete('/', profileController.deleteAccount);

module.exports = router; 