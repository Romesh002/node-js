const { body } = require('express-validator');

const createValidation = (req, res, next) => {
    [
        body('title')
            .isAlphanumeric()
            .isLength({ min: 3 })
            .trim(),
        body('imageUrl')
            .isURL(),
        body('description')
            .isAlphanumeric()
            .isLength({ min: 3, max: 5 })
            .trim(),
        body('price')
            .isFloat()
    ]
}

module.exports = createValidation;