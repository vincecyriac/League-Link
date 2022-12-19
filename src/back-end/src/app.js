const express = require('express');
const handleErrors = require('./middlewares/handle-errors.middleware');
const loginRouter = require('./routes/login.routes')
const userRouter = require('./routes/users.routes')
const app = require("./server");
const cors = require('cors');
const dotenv = require('dotenv');
const { NotFound } = require('./utils/errors.utils');

dotenv.config();

const { ORIGIN } = process.env;

app.use(express.json());

app.use(cors({
    origin: ORIGIN,
}))

app.use('/login', loginRouter)
app.use('/user', userRouter)
app.get('*', function (req, res, next) {
    next(new NotFound('not found'));
});

app.use(handleErrors);

module.exports = app;