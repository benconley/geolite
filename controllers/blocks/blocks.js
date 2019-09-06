const Blocks = require('../../models/Blocks/Blocks');

const BlockController = {
    async getByBoundaryBox(latArr, longArr) {
        const blocks = await Blocks.getByBoundaryBox(latArr, longArr);
        return Promise.resolve(blocks);
    },
    convertPointsForHeatMap(resultsArr) {
        // [lat, long, intensity]
        const respArr = [];
        resultsArr.forEach((element) => {
            respArr.push([element.latitude, element.longitude, 0.2]);
        });
        return respArr;
    },
};

module.exports = BlockController;
