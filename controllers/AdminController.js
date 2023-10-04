const ProductModel = require('../models/productModel');

exports.getCreateProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Create Product | eShop',
        isEditing: false
    });
}

// exports.postAddProduct = (req, res, next) => {
//     const title = req.body.title;
//     const imageUrl = req.body.imageUrl;
//     const description = req.body.description;
//     const price = req.body.price;
//     const product = new ProductModel(null, title, imageUrl, description, price);
//     product.save().then(() => {
//         res.redirect('/');
//     }).catch(err => {
//         console.log(err);
//     });
// }

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price
    }).then((result) => {
        // console.log(result);
        console.log("created product");
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
}

exports.getProducts = (req, res, next) => {
    ProductModel.findAll().then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            hasProduct: products.length > 0,
            activeShop: true
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getEditrProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;

    ProductModel.findByPk(prodId)
        .then(product => {
            if (!product) {
                return redirect('/');
            }
            res.render('admin/edit-product', {
                product: product,
                pageTitle: 'Edit Product',
                isEditing: editMode
            })
        })
}


exports.updateProduct = (req, res, next) => {
    // console.log(req.body);
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    ProductModel.findByPk(prodId).then(product => {
        product.title = updatedTitle;
        product.imageUrl = updatedImageUrl;
        product.price = updatedPrice;
        product.description = updatedDescription;
        return product.save();
    }).then(result => {
        console.log('Updated product!')
        res.redirect('/admin/products');
    })
        .catch(err => {
            console.log(err);
        });
}

exports.deleteProductById = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    ProductModel.findByPk(prodId).then(product => {
        return product.destroy();
    }).then(result => {
        console.log('Deleted');
        res.redirect('/admin/products');
    })
        .catch(err => {
            console.log(err);
        });
}