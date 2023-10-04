const path = require('path');

const express = require('express');

const ShopController = require('../controllers/ShopController');

const router = express.Router();


router.get('/', ShopController.getIndex);
router.get('/products', ShopController.getProducts);
router.get('/products/:productId', ShopController.getProductsDetails);
router.post('/cart', ShopController.addToCart);
router.get('/cart', ShopController.getCart);
router.post('/delete-cart-item', ShopController.deleteCartItem);
router.post('/create-order', ShopController.addOrder);
router.get('/orders', ShopController.getOrders);
router.get('/checkout', ShopController.getCheckOut);

module.exports = router;