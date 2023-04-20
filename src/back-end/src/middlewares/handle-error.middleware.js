const { GeneralError } = require("../utils/errors.utils");

const handleErrors = (err, req, res, next) => {
    if (err instanceof GeneralError) {
        return res.status(err.getCode()).json({
            message: err.message,
            errorCode : err.errorCode
        })
    }
    console.log(err);
    return res.status(500).json({
        status: 'Internal Server Error',
        message: err.message
    })
}

module.exports = handleErrors;