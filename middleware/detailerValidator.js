const { body } = require('express-validator');

const detailerValidator = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .trim(),
    body('email')
        .isEmail().withMessage('Email must be a valid email address')
];

module.exports =  detailerValidator;