const { GeneralError } = require("../utils/errors.utils");

// A middleware function to handle errors thrown in the request-response cycle
const handleErrors = (err, req, res, next) => {
    // Check if the error is an instance of GeneralError
    if (err instanceof GeneralError) {
        // If it is, return a JSON response with the error code and message from the error
        return res.status(err.getCode()).json({
            errorCode: err.errorCode,
            message: err.message
        });
    }
    // If the error is not an instance of GeneralError, it is an unexpected error
    // Return a generic 500 error code and the error message
    return res.status(500).json({
        errorCode: 500,
        message: err.message
    });
};

module.exports = handleErrors;