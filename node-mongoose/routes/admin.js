const express = require('express');
const { body } = require('express-validator');

const AdminController = require('../controllers/AdminController');
const ProductController = require('../controllers/ShopController');

const isAuth = require('../middleware/isAuth');  // IsAuthenticated middleware

const router = express.Router();

// prefix /admin
router.get('/create-product', isAuth, AdminController.getCreateProduct);

router.post('/create-product',
    [
        body('title')
            .isString()
            .withMessage('Title is missing or invalid')
            .isLength({ min: 3 })
            .trim(),
        body('imageUrl')
            .isURL().withMessage('Image URL is missing or not valid'),
        body('description')
            .isString()
            .isLength({ min: 3 })
            .trim().withMessage('Description is missing'),
        body('price')
            .isFloat().withMessage('Price is missing or invalid')
    ]
    , isAuth, AdminController.postAddProduct);

router.get('/products', isAuth, AdminController.getProducts);

router.get('/edit-product/:productId', isAuth, AdminController.getEditrProduct);

router.post('/update-product', [
    body('title')
        .isString()
        .withMessage('Title is missing or invalid')
        .isLength({ min: 3 })
        .trim(),
    body('imageUrl')
        .isURL().withMessage('Image URL is missing or not valid'),
    body('description')
        .isString()
        .isLength({ min: 3 })
        .trim().withMessage('Description is missing'),
    body('price')
        .isFloat().withMessage('Price is missing or invalid')
], isAuth, AdminController.updateProduct);

router.post('/delete-product', isAuth, AdminController.deleteProductById);



module.exports = router;