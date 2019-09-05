const boom = require('boom');

const errorHelper = {
    validationErrorToUi(validationError, messagePrefix) {
        if (!validationError) {
            return {};
        }

        const errorStatusCode = 422;

        const uiError = boom.boomify(new Error(), { override: false, statusCode: errorStatusCode });
        uiError.output.payload = {
            code: errorStatusCode,
            message: 'A validation error occurred.',
        };

        if (!validationError.details || validationError.details.length === 0) {
            return uiError;
        }

        const outputErrors = [];
        for (let errorCounter = 0;
            errorCounter < validationError.details.length;
            errorCounter += 1) {
            outputErrors.push({
                field: validationError.details[errorCounter].context.key,
                message: validationError.details[errorCounter].message,
            });
        }

        let messagePrefixString = '';
        if (messagePrefix) {
            messagePrefixString = `${messagePrefix} `;
        }
        uiError.output.payload.message = `${messagePrefixString}The specified fields have errors`;

        uiError.output.payload.errors = outputErrors;

        return uiError;
    },

    boomErrorToUi(boomError, messagePrefix) {
        if (!boomError) {
            return {};
        }

        const uiError = boom
            .boomify(new Error(), { override: false, statusCode: boomError.output.statusCode });
        uiError.output.payload = {
            code: boomError.output.statusCode,
            errors: [],
            message: boomError.message,
        };

        let messagePrefixString = '';
        if (messagePrefix) {
            messagePrefixString = `${messagePrefix} `;
        }
        uiError.output.payload.message = messagePrefixString + uiError.output.payload.message;

        return uiError;
    },

    arrayToUi(errorArray, messageText) {
        const errorStatusCode = 422;

        const uiError = boom.boomify(new Error(), { override: false, statusCode: errorStatusCode });
        uiError.output.payload = {
            code: errorStatusCode,
            message: 'The following errors were found:',
        };

        if (messageText) {
            uiError.output.payload.message = messageText;
        }

        if (!errorArray || errorArray.length === 0) {
            return uiError;
        }

        const outputErrors = [];
        for (let errorCounter = 0; errorCounter < errorArray.length; errorCounter += 1) {
            outputErrors.push({
                // field: '',
                message: errorArray[errorCounter],
            });
        }

        uiError.output.payload.errors = outputErrors;

        return uiError;
    },

};

module.exports = errorHelper;
