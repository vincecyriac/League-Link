const { body, header } = require('express-validator');
const { isValidInput } = require('../middlewares/validate.middleware');

const loginValidator = [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').exists().withMessage('Missing parameter').bail().notEmpty().withMessage("Please enter a valid password"),
    isValidInput
];

module.exports = { loginValidator }