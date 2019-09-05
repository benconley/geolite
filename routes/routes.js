const router = require('express').Router();
const path = require('path');
const asyncHandler = require('express-async-handler');
const boom = require('boom');

const BlockController = require('../controllers/blocks/blocks');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/map.html'));
});

router.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/map.html'));
});

router.get('/getIpsByBoundaryBox', asyncHandler(async (req, res, next) => {
    const latArr = req.query.latArr ? req.query.latArr : [];
    const longArr = req.query.longArr ? req.query.longArr : [];
    if (latArr.length !== 2 || longArr.length !== 2) {
        return next(boom.badRequest('invalid query'));
    }
    const qryResult = await BlockController.getByBoundaryBox(latArr, longArr);
    const mapPoints = await BlockController.convertPointsForHeatMap(qryResult);
    return res.json(mapPoints);
}));

module.exports = router;
