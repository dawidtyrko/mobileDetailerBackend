const {body} = require('express-validator');

const passwordValidation = [
    body('password')
        .isLength({ min: 8, max: 32 }).withMessage('Password must be at least 8 characters')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[\W_]/).withMessage('Password must contain at least one special character'),
    body('newPassword')
        .optional()
        .isLength({ min: 8, max: 32 }).withMessage('New password must be at least 8 characters')
        .matches(/\d/).withMessage('New password must contain at least one number')
        .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter')
        .matches(/[\W_]/).withMessage('New password must contain at least one special character'),
];

module.exports = passwordValidation;