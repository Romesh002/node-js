const express = require('express');
const { check, body } = require('express-validator');


const AuthController = require('../controllers/AuthController');
const isAuth = require('../middleware/isAuth');
const UserModel = require('../models/userModel');


const router = express.Router();

router.get('/register', AuthController.RegisterPage);
router.post('/register', [
    check('email').isEmail().withMessage('Please enter a valid email address')
        .custom((value, { req }) => {
            return UserModel.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email Already Exists, Please use other email');
                        // throw new Error('Email Already Exists, Please use other email');
                    }
                    return true;
                });
        }),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true; // Indicates the validation was successful.
    }),
],
    AuthController.RegisterUser);
router.get('/login', AuthController.LoginPage);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/reset-password-page', AuthController.resetPasswordPage);
router.post('/reset-password', AuthController.resetPassword);
router.get('/reset-password-page/:token', AuthController.newPasswordPage);
router.post('/update-password', AuthController.updatePassword);
router.post('/verify-otp', AuthController.verifyOtp);

module.exports = router;