const ProductModel = require('../models/productModel');
const OrderModel = require('../models/orderModel');
const { ObjectId } = require('mongodb');


exports.getProducts = (req, res, next) => {
    ProductModel.find()
        .then(products => {
            console.log(req.cookies.Name)
            res.render('shop/products', {
                prods: products,
                pageTitle: 'Products | eShop',
                path: '/',
                hasProduct: products.length > 0,
                activeShop: true,

            });
        }).catch(err => {
            console.log(err);
        });
}

exports.getProductsDetails = (req, res, next) => {

    const prodId = req.params.productId;
    ProductModel.findById(prodId)
        // .select('title description price imageUrl')
        // .populate('userId')
        .then((product) => {
            console.log(product)
            res.render('shop/product-details', {
                product: product,
                pageTitle: product.title + ' | eShop',
                path: '/',
                hasProduct: product.length > 0,
                activeShop: true,

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
    ProductModel.find().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop | eShop',
            path: '/',
            hasProduct: products.length > 0,
            activeShop: true,

        });
    }).catch(err => {
        console.log(err);
    });
}



exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items;
            // products = [];
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: "Your Cart | eShop",
                products: products,

            })
        }).catch(err => {
            console.log(err);
        });

}

exports.addOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(item => {
                return { quantity: item.quantity, productsData: { ...item.productId._doc } };
            });

            console.log('PRODUCTS :', products);
            console.log('USER :', {
                email: req.user.email,
                userId: req.user
            },);

            const order = new OrderModel({
                products: products,
                user: {
                    username: req.user.username,
                    email: req.user.email,
                    userId: req.user
                },
            });
            // console.log(order)
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        }).then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getCheckOut = (req, res, next) => {

    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: "Checkout | eShop",

    })
}

exports.getOrders = (req, res, next) => {
    OrderModel.find({ "user.userId": req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                orders: orders,

            })
        }).catch(err => {
            console.log(err);
        });
}

exports.getBlogs = (req, res, next) => {
    res.render('shop/blogs', {
        pageTitle: 'Blogs',
    });
}