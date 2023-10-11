const ProductModel = require('../models/productModel');
const CartModel = require('../models/cartModel');
const Order = require('../models/orderModel');
const { ObjectId } = require('mongodb');

// exports.getProducts = (req, res, next) => {
//     ProductModel.fetchAll().then(([rows, fieldData]) => {
//         res.render('shop/products', {
//             prods: rows,
//             pageTitle: 'Shop | eShop',
//             path: '/',
//             hasProduct: rows.length > 0,
//             activeShop: true
//         });
//     }).catch(err => {
//         console.log(err);
//     });
// }

exports.getProducts = (req, res, next) => {
    ProductModel.fetchAll().then(products => {
        res.render('shop/products', {
            prods: products,
            pageTitle: 'Products | eShop',
            path: '/',
            hasProduct: products.length > 0,
            activeShop: true
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getProductsDetails = (req, res, next) => {

    const prodId = req.params.productId;
    ProductModel.findById(prodId).then((product) => {
        console.log('Product fetched');
        console.log(product);
        res.render('shop/product-details', {
            product: product,
            pageTitle: product.title + ' | eShop',
            path: '/',
            hasProduct: product.length > 0,
            activeShop: true
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.addToCart = (req, res, next) => {
    const prodId = req.body.prodId;
    ProductModel.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        }).then(result => {
            console.log('Added to Cart : ', result);
            res.redirect('/cart');
        }).catch(err => {
            console.log(err)
        });
}

exports.deleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}


exports.getIndex = (req, res, next) => {
    ProductModel.fetchAll().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop | eShop',
            path: '/',
            hasProduct: products.length > 0,
            activeShop: true
        });
    }).catch(err => {
        console.log(err);
    });
}



exports.getCart = (req, res, next) => {
    req.user.getCart().then(products => {
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: "Your Cart | eShop",
            products: products
        })
    }).catch(err => {
        console.log(err);
    });

}

exports.addOrder = (req, res, next) => {
    req.user.addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getCheckOut = (req, res, next) => {

    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: "Checkout | eShop"
    })
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders().then(orders => {
        res.render('shop/orders', {
            pageTitle: 'Your Orders',
            orders: orders
        })
    }).catch(err => {
        console.log(err);
    });
}