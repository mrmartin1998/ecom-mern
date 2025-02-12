const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const userController = new UserController();

router.get('/', auth, userController.index);
router.get('/:id', auth, userController.show);
router.post('/', userController.store);
router.put('/:id', auth, userController.update);
router.delete('/:id', auth, userController.delete);

module.exports = router; 