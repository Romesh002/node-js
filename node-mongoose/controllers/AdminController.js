const ProductModel = require('../models/productModel');
const { validationResult } = require('express-validator');
const mongodb = require('mongodb');

const ObjectId = mongodb.ObjectId;

exports.getCreateProduct = (req, res, next) => {

    res.render('admin/edit-product', {
        pageTitle: 'Create Product | eShop',
        errorMsg: [],
        isEditing: false
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Create Product | eShop',
            errorMsg: errors.array()[0].msg,
            isEditing: false
        });
    }
    const product = new ProductModel({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.session.user._id
    });
    product.save()
        .then((result) => {
            console.log(result);
            console.log("created product");
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
        });
}

exports.getProducts = (req, res, next) => {
    ProductModel.find({ userId: req.user._id }).then(products => {
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
    ProductModel.findById(prodId)
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

    ProductModel.updateOne(
        { _id: prodId },
        {
            $set: {
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDescription
            }
        })
        .then(result => {
            console.log(result)
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.deleteProductById = (req, res, next) => {
    const prodId = req.body.productId;
    ProductModel.findByIdAndRemove(prodId)
        .then(result => {
            console.log('Deleted');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
}