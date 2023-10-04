const ProductModel = require('../models/productModel');
const CartModel = require('../models/cartModel');
const Order = require('../models/orderModel');

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
    ProductModel.findAll().then(products => {
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


// exports.getProductsDetails = (req, res, next) => {
//     const prodId = req.params.productId;
//     ProductModel.findById(prodId).then(([product]) => {
//         res.render('shop/product-details', {
//             product: product[0],
//             pageTitle: product[0].title + ' | eShop',
//             path: '/',
//             hasProduct: product[0].length > 0,
//             activeShop: true
//         });
//     }).catch(err => {
//         console.log(err);
//     });
// }

exports.getProductsDetails = (req, res, next) => {
    const prodId = req.params.productId;
    ProductModel.findByPk(prodId).then((product) => {
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
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return ProductModel.findByPk(prodId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.deleteCartItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } })
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}

// exports.getIndex = (req, res, next) => {
//     ProductModel.fetchAll().then(([rows, fieldData]) => {
//         res.render('shop/index', {
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

exports.getIndex = (req, res, next) => {
    ProductModel.findAll().then(products => {
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
    req.user.getCart().then(cart => {
        return cart.getProducts().then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: "Your Cart | eShop",
                products: products
            })
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.addOrder = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = { quantity: product.cartItem.quantity };
                            return product;
                        })
                    )
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .then(result => {
            return fetchedCart.setProducts(null);

        })
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
    req.user.getOrders({ include: ['products'] })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: "Orders | eShop",
                orders: orders
            });
        })
        .catch(err => {
            console.log(err);
        })

}