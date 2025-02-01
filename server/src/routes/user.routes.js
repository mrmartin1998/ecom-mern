const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

const userController = new UserController();

router.get('/', userController.index);
router.get('/:id', userController.show);
router.post('/', userController.store);
router.put('/:id', auth, userController.update);
router.delete('/:id', auth, userController.delete);

module.exports = router; 