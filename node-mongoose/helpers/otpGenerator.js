const speakeasy = require("speakeasy");
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const UserModel = require("../models/userModel");
const otpModel = require("../models/otp");

const generateOtp = () => {
    // Generate a secret key.
    const secretOtp = speakeasy.generateSecret({ length: 6 });

    const otp = speakeasy.totp({
        secret: secretOtp.base32,
        encoding: 'base32'
    });

    return otpModel.find({ secretOtp: otp }).then(result => {
        if (result.length > 0) {
            return generateOtp();
        } else {
            return otp;
        }
    }).catch(err => {
        console.log(err);
        return err;
    })

}

const sendOtpViaSms = (phoneNumber, otp) => {
    return client.messages.create({
        body: `Your OTP for verification: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
    });
};



module.exports = {
    generateOtp: generateOtp,
    sendOtpViaSms: sendOtpViaSms
};