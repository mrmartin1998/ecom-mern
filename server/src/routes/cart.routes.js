const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const cartController = new CartController();

router.get('/', auth, cartController.index);
router.get('/:id', auth, cartController.show);
router.post('/', auth, cartController.store);
router.post('/:id/items', auth, cartController.addItem);
router.delete('/:id/items/:productId', auth, cartController.removeItem);
router.delete('/:id', auth, cartController.delete);

module.exports = router; 