const { body } = require('express-validator');

const userValidator = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .trim(),
    body('age')
        .optional()
        .isInt({ min: 0 }).withMessage('Age must be a non-negative integer'),
    body('email')
        .isEmail().withMessage('Email must be a valid email address')
];

module.exports =  userValidator;
