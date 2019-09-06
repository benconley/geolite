const appRoot = require('app-root-path');
const mockKnex = require('mock-knex');
const proxyquire = require('proxyquire');
const geoliteDB = require('../../dao/knex/geolite');
const { getByBoundaryBoxMock } = require('../Blocks/Blocks.mock');

mockKnex.mock(geoliteDB);
const queryTracker = mockKnex.getTracker();
queryTracker.install();

describe('Blocks Model', () => {
    let Blocks;
    beforeAll(() => {
        Blocks = proxyquire('./Blocks', { [`${appRoot}/dao/knex/geolite`]: geoliteDB });
        queryTracker.install();
    });
    afterAll(() => {
        queryTracker.uninstall();
    });
    describe('get by boundary box', () => {
        beforeEach(() => {
            queryTracker.on('query', (query) => {
                query.response(getByBoundaryBoxMock);
            });
        });
        it('should return results for boundary box', (done) => {
            Blocks.getByBoundaryBox([0, 1], [0, 1]).then((results) => {
                expect(results.length).toEqual(getByBoundaryBoxMock.length);
                done();
            });
        });
    });
});
