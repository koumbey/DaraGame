const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const usersRouter = require('./routes/users');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = express();

// view engine setup
api.set('views', path.join(__dirname, 'views'));
api.set('view engine', 'pug');

api.use(logger('dev'));
api.use(express.json());
api.use(express.urlencoded({ extended: false }));
api.use(cookieParser());
api.use(cors());
api.use(bodyParser.urlencoded({extended: false}));
api.use(bodyParser.json());


api.use('/users', usersRouter);

// catch 404 and forward to error handler
api.use(function(req, res, next) {
    next(createError(404));
});

// error handler
api.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = api;
