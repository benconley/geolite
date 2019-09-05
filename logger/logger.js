require('dotenv').config();
const {
    format,
    transports,
    createLogger,
    addColors,
} = require('winston');

const env = process.env.NODE_ENV;

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        audit: 2,
        info: 3,
        verbose: 4,
        debug: 5,
        silly: 6,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        audit: 'magenta',
        info: 'green',
        verbose: 'blue',
        debug: 'cyan',
        silly: 'gray',
    },
};

const getConsoleTransport = () => {
    if (process.env.LOG_FORMAT === 'dev') {
        return new transports.Console({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`,
                ),
            ),
        });
    }
    return new transports.Console({
        format: format.combine(
            format.timestamp(),
            format.json(
                content => content.message,
            ),
        ),
    });
};

const logger = createLogger({
    levels: customLevels.levels,
    level: env === 'development' ? 'debug' : 'info',
    transports: [
        getConsoleTransport(),
    ],
});

addColors(customLevels.colors);

logger.audit = (req, audit) => {
    const { auth, path, method } = req;
    const { action } = audit;
    if (!auth) {
        throw new Error('Invalid request object. Must contain an auth property.');
    }
    if (!path) {
        throw new Error('Invalid request object. Must contain a path property.');
    }
    if (!method) {
        throw new Error('Invalid request object. Must contain a method property.');
    }
    if (!action) {
        throw new Error('Invalid audit object. Must contain an action property.');
    }
    logger.log(
        'audit',
        `${auth.user} - ${action}`,
        {
            user: auth.user, path, method, ...audit,
        },
    );
};

logger.auditMultiple = (req, auditArray) => {
    auditArray.forEach((auditObj) => {
        logger.audit(req, auditObj);
    });
};

module.exports = logger;
