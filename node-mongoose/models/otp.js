const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const otpSchema = new Schema({
    secretOtp: {
        type: String,
        required: true
    },

    email: { type: String, required: true },


})

module.exports = mongoose.model('Otp', otpSchema);