//handle pagination parameters
const paginate = async (req, res, next) => {
    req.body.limit = parseInt(req.query.limit) || 50
    req.body.offset = (parseInt(req.query.page) - 1) * req.query.limit || 0
    next()
};

module.exports = { paginate };