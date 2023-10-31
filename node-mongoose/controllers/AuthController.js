const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const ejs = require('ejs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const path = require('path');
const templatePath = path.join(__dirname, '..', 'views/emails', 'registration.ejs');
const transport = require('../utils/config.email');
const { generateOtp, sendOtpViaSms } = require('../helpers/otpGenerator');
const otpModel = require("../models/otp");


exports.RegisterPage = (req, res, next) => {
    // console.log(templatePath);
    res.render('auth/signup', {
        pageTitle: 'Register | eShop',
        isAuthenticated: false,
        csrfToken: req.csrfToken(),
        errorMsg: req.flash('error')
    });
}

exports.RegisterUser = (req, res, next) => {

    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).render('auth/signup', {
            pageTitle: 'Register | eShop',
            errorMsg: error.array()[0].msg,
        });
    }

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new UserModel({
                phone: phone,
                email: email,
                password: hashedPassword,
                isVerified: false,
                cart: { items: [] }
            });
            return user.save();
        })
        .then(user => {
            return generateOtp();
        })
        .then(secretotp => {
            const otpData = new otpModel({
                secretOtp: secretotp,
                email: email
            });
            req.session.verifyPending = true;
            otpData.save();
            if (req.session.verifyPending) {
                const mailOptions = {
                    from: 'support@eshop.com',
                    to: email,
                    subject: 'Your one time password (OTP)',
                    html: `<p> Your one time password is <span style="font-weight:bolder"> ${secretotp} </span>, Please verify your account.</p>`
                };
                transport.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
                sendOtpViaSms(phone, secretotp)
                    .then(() => {
                        res.send('OTP sent successfully');
                    })
                    .catch(error => {
                        console.error('Error sending OTP:', error);
                        res.status(500).send('Error sending OTP');
                    });

                return res.render('auth/otpveryfication', {
                    pageTitle: 'Verify OTP',
                    email: email
                });
            } else {
                return res.redirect('/');
            }
        })
        .catch(err => {
            console.log(err);
        });

}

exports.verifyOtp = (req, res, next) => {
    const email = req.body.email;
    const otp = req.body.otp;
    otpModel.findOne({ email: email, secretOtp: otp })
        .then(otpData => {
            return UserModel.findOne({ email: email })
        }).then(user => {
            user.isVerified = true;
            return user.save()
        }).then(result => {
            ejs.renderFile(templatePath, (err, data) => {
                if (err) {
                    console.log('Error rendering email template:', err);
                } else {
                    // Email options
                    const mailOptions = {
                        from: 'support@eshop.com',
                        to: email,
                        subject: 'Registeration Mail',
                        html: data
                    };
                    // Send email
                    transport.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log('Error sending email:', error);
                        } else {
                            console.log('Email sent:', info.response);
                        }
                    });
                }
            });
            return res.redirect('/login');
        })
}

exports.LoginPage = (req, res, next) => {
    if (req.session.isLoggedin) {
        return res.redirect('/');
    }
    // res.cookie('name', 'ROMESH', { maxAge: new Date(Date.now() + (1000 * 60 * 60 * 48)), httpOnly: true });
    res.render('auth/login', {
        pageTitle: 'Login | eShop',
        errorMsg: req.flash('error')
    });
}


exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    UserModel.findOne({ email: email, isVerified: true })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    console.log(doMatch);
                    if (doMatch) {
                        req.session.isLoggedin = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        })
                    } else {
                        req.flash('error', 'Invalid email or password.');
                        return res.redirect('/login');
                    }
                });
        })
        .catch(err => {
            console.log(err)
            return res.redirect('/login');
        });
}

exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
    });
    res.redirect('/login');
}

exports.resetPasswordPage = (req, res, next) => {
    res.render('auth/resetPassword', {
        pageTitle: 'Forgot Password | eShop',
        errorMsg: req.flash('error')
    });
}



exports.resetPassword = (req, res, next) => {

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset-password');
        }

        const token = buffer.toString('hex');
        UserModel.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                req.flash('error', 'No account with that email found.');
                return res.redirect('/reset-password-page');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        }).then(result => {

            const mailOptions = {
                from: 'support@eshop.com',
                to: req.body.email,
                subject: 'Forgot Password',
                html: `<p>You have requested a password reset link</p>
                       <p>Click here to reset your password: </p> <a href="http://localhost:5000/reset-password-page/${token}">Reset Link</a>`
            };
            // Send email
            transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
            res.redirect('/');
        })
            .catch(err => {
                console.log(err);
                return res.redirect('/reset-password-page');
            })
    });
}

exports.newPasswordPage = (req, res, next) => {
    const token = req.params.token;
    UserModel.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }).then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        res.render('auth/new-password', {
            pageTitle: 'New Password | eShop',
            errorMsg: message,
            userId: user._id.toString(),
            passwordToken: token
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.updatePassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    UserModel.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
        .then(user => {
            passwordResetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            console.log(hashedPassword);
            passwordResetUser.password = hashedPassword;
            passwordResetUser.resetToken = undefined;
            passwordResetUser.resetTokenExpiration = undefined;
            return passwordResetUser.save();
        })
        .then(result => {
            const mailOptions = {
                from: 'support@eshop.com',
                to: passwordResetUser.email,
                subject: 'Forgot Password',
                html: `<p>Your password has been updated successfully</p>`
            };
            // Send email
            transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
            res.redirect('/login')
        })
        .catch(err => {
            console.log(err);
        });
}

