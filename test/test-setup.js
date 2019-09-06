jest.unmock('dotenv');
jest.unmock('winston');
jest.unmock('moment');
jest.unmock('tiny-async-pool');
const logger = require('../logger');

// Turn off winston transport
module.exports = () => {
    logger.transports[0].silent = true;
};
