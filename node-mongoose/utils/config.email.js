const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "e020c3bc1919c8",
        pass: "21714691fde405"
    }
});