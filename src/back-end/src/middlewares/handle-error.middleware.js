const { GeneralError } = require("../utils/errors.utils");

const handleErrors = (err, req, res, next) => {
    if (err instanceof GeneralError) {
        return res.status(err.getCode()).json({
            message: err.message || "Something went wrong unexpectedly, Please find the log",
            errorCode: err.errorCode
        })
    }
    global.logger.error(err.stack)
    return res.status(500).json({
        status: 'Internal Server Error',
        message: "Please find the log"
    })
}

module.exports = handleErrors;