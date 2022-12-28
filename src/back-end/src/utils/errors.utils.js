// GeneralError is the base class for all the other error classes
// It extends the built-in Error class and has two properties: message and errorCode
class GeneralError extends Error {
    constructor(message, errorCode) {
        super(message); // calling the super class's constructor with the message argument
        this.errorCode = errorCode;
    }

    // getCode is a method that returns the HTTP status code for the error
    getCode() {
        if (this instanceof BadRequest) {
            return 400;
        }
        if (this instanceof NotFound) {
            return 404;
        }
        if (this instanceof Forbidden) {
            return 403;
        }
        if (this instanceof Unauthorized) {
            return 401;
        }
        // return 500 for all other errors
        return 500;
    }
}

// BadRequest error class extends GeneralError
class BadRequest extends GeneralError { }

// NotFound error class extends GeneralError
class NotFound extends GeneralError { }

// Forbidden error class extends GeneralError
class Forbidden extends GeneralError { }

// Unauthorized error class extends GeneralError
class Unauthorized extends GeneralError { }

// Exporting all the error classes
module.exports = {
    GeneralError,
    BadRequest,
    NotFound,
    Forbidden,
    Unauthorized,
};
