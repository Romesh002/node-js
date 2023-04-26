const { users, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const { API_URL } = require('../config/api.config');
const jwt = require('jsonwebtoken')

// sequelize
const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        //find a user by their email
        const user = await users.findOne({
            where: {
                email: email
            }

        });

        //if user email is found, compare password with bcrypt
        if (user) {
            const isSame = await bcrypt.compare(password, user.password);

            //if password is the same
            //generate token with the user's id and the secretKey in the env file

            if (isSame) {
                const payload = {
                    _id: user.id,
                    _email: user.email
                }
                // console.log()
                let token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                    expiresIn: 1 * 24 * 60 * 60 * 1000,
                });

                //if password matches wit the one in the database
                //go ahead and generate a cookie for the user
                res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
                console.log("user", JSON.stringify(user, null, 2));
                console.log(token);
                //send user data
                return res.status(201).send({
                    error: false,

                    user: {
                        id: payload._id,
                        email: payload._email,
                    },
                    _token: token,
                });
            } else {
                return res.status(401).send({ error: true, messgae: "Authentication failed" });
            }
        } else {
            return res.status(401).send({ error: true, messgae: "Authentication failed" });
        }
    } catch (error) {
        console.log(error);
    }

}

const register = async (req, res) => {

    const {
        firstName,
        lastName,
        email,
        password
    } = req.body;
    try {
        const user = await users.create({
            firstName,
            lastName,
            email,
            status: 1,
            password: await bcrypt.hash(password, 10),
            image: req.file.filename
        })
        return res.status(200).json({
            message: "User created successfully!",
            error: false
        })
    }
    catch (e) {
        console.log(e, 'e')
        return res.status(500).json({
            message: e.message,
            error: true
        });
    }
}

const updateProfile = (req, res) => {

}

const getUsers = async (req, res) => {
    const { _id } = req.query;
    try {
        const userData = await users.findOne({ where: { id: _id }, attributes: ['id', 'firstName', 'lastName', 'email', 'image'] })
        userData.setDataValue('image', `${API_URL}/${userData.image}`);
        return res.status(200).json({
            message: "Requested successfully!",
            error: false,
            data: userData,
        })
    }
    catch (e) {
        console.log(e, 'e')
        return res.status(500).json({
            message: e.message,
            error: true
        });
    }
}

module.exports = {
    login,
    register,
    updateProfile,
    getUsers
}