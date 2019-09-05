const geoliteDB = require('../../dao/knex/geolite');

const Blocks = {
    getByBoundaryBox: (latArr, longArr) => geoliteDB('blocks_ipv4_concise')
        .where('latitude', '>=', Math.min(...latArr))
        .andWhere('latitude', '<=', Math.max(...latArr))
        .andWhere('longitude', '>=', Math.min(...longArr))
        .andWhere('longitude', '<=', Math.max(...longArr)),
};

module.exports = Blocks;
