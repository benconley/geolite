module.exports = {
    format: {
        combine: jest.fn(),
        timestamp: jest.fn(),
        colorize: jest.fn(),
        printf: jest.fn(),
        json: jest.fn(),
    },
    transports: {
        Console: jest.fn(),
    },
    createLogger: jest.fn().mockReturnValue({
        log: jest.fn(),
    }),
    addColors: jest.fn(),
};
