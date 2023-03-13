// Import required modules
const { validationResult, header } = require('express-validator')

// Middleware to validate request body
const isValidInput = (req, res, next) => {
    // Validate input and format errors
    const errors = validationResult(req).formatWith(({ msg, param }) => ({ error: msg, field: param }));

    // If no errors, move to next middleware
    if (errors.isEmpty()) {
        return next();
    }

    // Otherwise, return 400 status and errors as JSON
    return res.status(400).json({ errors: errors.array() });
};

// Middleware to validate request headers
const isValidHeader = (req, res, next) => {
    // Get validation rules for the current API path
    const validationRules = getVlidationRules(`${req.method}:${req.originalUrl}`)

    // Run validation rules for each header
    Promise.all(validationRules.map((rule) => rule.run(req)))
        .then(() => {
            // Format errors
            const errors = validationResult(req).formatWith(({ msg, param }) => ({ error: msg, header: param }));

            // If no errors, move to next middleware
            if (errors.isEmpty()) {
                return next();
            }

            // Otherwise, return 400 status and errors as JSON
            return res.status(400).json({ errors: errors.array() });
        })
        .catch((error) => next(error));
};

// Get validation rules based on the current API path
const getVlidationRules = (apiPath) => {
    // Define lists of API paths and their corresponding validation rules
    const urlPatternOneList = ['GET:/login']
    const urlPatternTwoList = ['POST:/login']

    // Return the appropriate validation rules based on the API path
    if (urlPatternOneList.includes(apiPath)) {
        return [
            header('Content-Type').exists().withMessage('Content Type header is required').bail().equals('application/json').withMessage('Invalid content type'),
            header('Authorization').exists().withMessage('Authorization header is required')]
    } else if (urlPatternTwoList.includes(apiPath)) {
        return [
            header('Content-Type').exists().withMessage('Content Type header is required').bail().equals('application/json').withMessage('Invalid content type')
        ]
    }
}

// Export middleware functions
module.exports = { isValidInput, isValidHeader }
