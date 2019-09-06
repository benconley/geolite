/* eslint-disable global-require */

const winston = require('winston');

const customColors = {
    error: 'red',
    warn: 'yellow',
    audit: 'magenta',
    info: 'green',
    verbose: 'blue',
    debug: 'cyan',
    silly: 'gray',
};

describe('Logger', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('Setup', () => {
        it('should use colorized json output if LOG_FORMAT env is set to dev', () => {
            jest.isolateModules(() => {
                process.env.LOG_FORMAT = 'dev';
                require('./logger');
                expect(winston.format.colorize).toHaveBeenCalled();
            });
        });
        it('should use a custom format if LOG_FORMAT env is set to dev', () => {
            jest.isolateModules(() => {
                process.env.LOG_FORMAT = 'dev';
                require('./logger');
                expect(winston.format.printf).toHaveBeenCalled();
                expect(winston.format.printf).toHaveBeenCalledWith(expect.any(Function));
            });
        });
        it('should not be colorized if LOG_FORMAT env is not set to dev', () => {
            jest.isolateModules(() => {
                process.env.LOG_FORMAT = '';
                require('./logger');
                expect(winston.format.colorize).not.toHaveBeenCalled();
            });
        });
        it('should not use a custom format if LOG_FORMAT env is set to dev', () => {
            jest.isolateModules(() => {
                process.env.LOG_FORMAT = '';
                require('./logger');
                expect(winston.format.printf).not.toHaveBeenCalled();
            });
        });
        it('should expose debug and up when NODE_ENV is development', () => {
            jest.isolateModules(() => {
                process.env.NODE_ENV = 'development';
                require('./logger');
                expect(winston.createLogger).toHaveBeenCalledWith(expect.objectContaining({ level: 'debug' }));
            });
        });
        it('should expose info and up when NODE_ENV is not development', () => {
            jest.isolateModules(() => {
                process.env.NODE_ENV = 'production';
                require('./logger');
                expect(winston.createLogger).toHaveBeenCalledWith(expect.objectContaining({ level: 'info' }));
            });
        });
        it('should create a logger with an audit level added', () => {
            jest.isolateModules(() => {
                process.env.NODE_ENV = 'development';
                require('./logger');
                expect(winston.createLogger).toHaveBeenCalledWith(
                    expect.objectContaining(
                        {
                            levels: expect.objectContaining(
                                { audit: 2 },
                            ),
                        },
                    ),
                );
            });
        });
        it('should set up the correct colors', () => {
            jest.isolateModules(() => {
                process.env.NODE_ENV = 'development';
                require('./logger');
                expect(winston.addColors).toHaveBeenCalledWith(
                    expect.objectContaining(customColors),
                );
            });
        });
    });
    describe('Audit log', () => {
        let logger;
        beforeAll(() => {
            logger = require('./logger');
        });
        it('should throw if the req parameter does not include an auth object', () => {
            expect(
                () => logger.audit({ path: 'some/url', method: 'POST' }, { action: 'test' }),
            ).toThrow('Invalid request object. Must contain an auth property.');
        });
        it('should throw if the req parameter does not include a path', () => {
            expect(
                () => logger.audit({ auth: {}, method: 'POST' }, { action: 'test' }),
            ).toThrow('Invalid request object. Must contain a path property.');
        });
        it('should throw if the req parameter does not include a method', () => {
            expect(
                () => logger.audit({ auth: {}, path: 'some/url' }, { action: 'test' }),
            ).toThrow('Invalid request object. Must contain a method property.');
        });
        it('should throw if the audit parameter does not include an action', () => {
            expect(
                () => logger.audit({ method: 'POST', auth: {}, path: 'some/url' }, {}),
            ).toThrow('Invalid audit object. Must contain an action property.');
        });
        it('should log with the type as audit, a message with the action and user, and all audit parameter keys', () => {
            logger.audit({ auth: { user: 'testman' }, method: 'POST', path: 'some/url' }, { action: 'test', test: 'cool' });
            expect(logger.log).toHaveBeenCalledWith(
                expect.stringMatching('audit'),
                expect.stringMatching('testman - test'),
                expect.objectContaining({ action: 'test', test: 'cool' }),
            );
        });
    });
});
