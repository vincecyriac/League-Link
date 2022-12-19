const { GeneralError } = require("../utils/errors.utils");

const handleErrors = (err, req, res, next) => {
    if (err instanceof GeneralError) {
        return res.status(err.getCode()).json({
            errorCode : err.errorCode,
            message: err.message
        })
    }
    return res.status(500).json({
        errorCode : 5000,
        message: err.message
    })
}

module.exports = handleErrors;