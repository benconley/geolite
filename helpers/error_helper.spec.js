const joi = require('joi');
const boom = require('boom');

const errorHelper = require('./error_helper');

const schema = joi.object().keys({
    test: joi.boolean().label('Test').required(),
});


describe('Error Helper', () => {
    describe('validationErrorToUi', () => {
        it('should return an empty object', (done) => {
            const result = errorHelper.validationErrorToUi(null);
            expect(result).not.toBeNull();
            done();
        });
        it('should return a formatted error object', (done) => {
            const validationResult = joi.validate({}, schema);
            const result = errorHelper.validationErrorToUi(validationResult.error);
            expect(result).not.toBeNull();
            expect(result.output.payload.message).toEqual('The specified fields have errors');
            done();
        });
        it('should return a formatted error object', (done) => {
            const validationResult = joi.validate({}, schema);
            const result = errorHelper.validationErrorToUi(validationResult.error, 'Testing');
            expect(result).not.toBeNull();
            expect(result.output.payload.message).toEqual('Testing The specified fields have errors');
            done();
        });
    });
    describe('boomErrorToUi', () => {
        it('should return an empty object', (done) => {
            const result = errorHelper.boomErrorToUi(null);
            expect(result).not.toBeNull();
            done();
        });
        it('should return a formatted error object', (done) => {
            const result = errorHelper.boomErrorToUi(boom.badData('The specified fields have errors'), 'Testing');
            expect(result).not.toBeNull();
            expect(result.output.payload.message).toEqual('Testing The specified fields have errors');
            done();
        });
    });
    describe('arrayToUi', () => {
        it('should return an empty object', (done) => {
            const result = errorHelper.arrayToUi(null);
            expect(result).not.toBeNull();
            done();
        });
        it('should return a formatted error object from an array', (done) => {
            const result = errorHelper.arrayToUi(['An error happened :('], 'Testing');
            expect(result).not.toBeNull();
            expect(result.output.payload.message).toEqual('Testing');
            expect(result.output.payload.errors.length).toEqual(1);
            done();
        });
    });
});
