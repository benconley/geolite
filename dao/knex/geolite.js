require('dotenv').config();

const options = {
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST_GEOLITE,
        user: process.env.DB_USER_GEOLITE,
        password: process.env.DB_PASS_GEOLITE,
        database: process.env.DB_NAME_GEOLITE,
        port: process.env.DB_PORT_GEOLITE || 3306,
        multipleStatements: true,
        timezone: 'Z',
        typeCast: (field, next) => {
            if (field.type === 'TINY' && field.length === 1) {
                const value = field.string();
                return value ? (value === '1') : null;
            }
            return next();
        },
    },
    pool: { min: 0, max: 60 },
};

module.exports = require('knex')(options);
