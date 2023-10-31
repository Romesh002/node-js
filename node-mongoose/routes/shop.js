const path = require('path');

const express = require('express');

const ShopController = require('../controllers/ShopController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();


router.get('/', ShopController.getIndex);

router.get('/products', ShopController.getProducts);

router.get('/products/:productId', ShopController.getProductsDetails);

router.post('/cart', isAuth, ShopController.addToCart);

router.get('/cart', isAuth, ShopController.getCart);

router.post('/delete-cart-item', isAuth, ShopController.deleteCartItem);

router.post('/create-order', isAuth, ShopController.addOrder);

router.get('/orders', isAuth, ShopController.getOrders);

router.get('/blogs', ShopController.getBlogs);

// router.get('/checkout', ShopController.getCheckOut);


module.exports = router;