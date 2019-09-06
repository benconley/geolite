const BlocksController = require('./blocks');
const mockBlockData = require('../../models/Blocks/Blocks.mock');
const Blocks = require('../../models/Blocks/Blocks');

jest.mock('../../models/Blocks/Blocks');
jest.mock('../../helpers/error_helper');

describe('Blocks Controller', () => {
    describe('get all', () => {
        beforeAll(() => {
            Blocks.getByBoundaryBox.mockResolvedValue(mockBlockData.getByBoundaryBoxMock);
        });
        it('should get blocks by boundary box', (done) => {
            BlocksController.getByBoundaryBox([0, 1], [0, 1]).then((result) => {
                expect(result.length).toEqual(mockBlockData.getByBoundaryBoxMock.length);
                done();
            });
        });
    });
});
