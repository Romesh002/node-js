const path = require('path');

const express = require('express');

const AdminController = require('../controllers/AdminController');
const ProductController = require('../controllers/ShopController');

const router = express.Router();

// prefix /admin
router.get('/create-product', AdminController.getCreateProduct);
router.get('/products', AdminController.getProducts);

router.post('/create-product', AdminController.postAddProduct);
router.get('/edit-product/:productId', AdminController.getEditrProduct);
router.post('/update-product', AdminController.updateProduct);
router.post('/delete-product', AdminController.deleteProductById);


module.exports = router;