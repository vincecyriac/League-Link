class GeneralError extends Error {
    constructor(message,errorCode) {
        super();
        this.message = message;
        this.errorCode = errorCode;
    }

    getCode() {
        if (this instanceof BadRequest) {
            return 400;
        } if (this instanceof NotFound) {
            return 404;
        } if (this instanceof Forbidden) {
            return 403;
        } if (this instanceof Unauthorized) {
            return 401;
        }
        return 500;
    }
}

class BadRequest extends GeneralError { }
class NotFound extends GeneralError { }
class Forbidden extends GeneralError { }
class Unauthorized extends GeneralError { }

module.exports = {
    GeneralError,
    BadRequest,
    NotFound,
    Forbidden,
    Unauthorized
}