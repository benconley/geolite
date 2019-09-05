require('dotenv').config();
const express = require('express');
const boom = require('boom');
const morgan = require('morgan');
const logger = require('./logger');

const app = express();
const routes = require('./routes/routes');

const port = process.env.NODE_PORT;

// HTTP Request Logging
app.use(morgan('combined'));

// headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// routes
app.use(routes);

// handle 404
app.use((req, res, next) => {
    next(boom.notFound());
});
// Error Handling Middleware
app.use((err, req, res, next) => { /* eslint-disable-line */
    if (!err.isBoom) {
        return next(err);
    }
    logger.error(`${err.output.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(err.output.statusCode).json(err.output.payload);
});
// Catch all Error Handler
app.use((err, req, res, next) => { /* eslint-disable-line */
    logger.error(`500 - Unhandled Exception - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.sendStatus(500);
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        logger.debug(`Example app listening on port ${port}!`);
    });
}
module.exports = app;
