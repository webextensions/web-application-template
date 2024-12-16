import stringifyCompact from 'json-stringify-pretty-compact';

const sendErrorResponse = function (res, statusCode, errorMessage, output) {
    const responseToSend = {
        statusCode,
        status: 'error'
    };

    if (errorMessage) {
        responseToSend.errorMessage = errorMessage;
    }
    if (output !== undefined) {
        responseToSend.output = output;
    }

    return (
        res
            .status(statusCode)
            .send(responseToSend)
    );
};

const sendSuccessResponse = function (
    res,
    output,
    options = {}
) {
    const responseToSend = {
        status: 'success'
    };

    if (output !== undefined) {
        responseToSend.output = output;
    }

    if (options?.readable || options?.beautify) {
        res.header('Content-Type', 'application/json');

        if (options?.readable) {
            return res.send(stringifyCompact(responseToSend, { maxLength: 120, indent: 4 }));
        } else { // else if (options?.beautify)
            return res.send(JSON.stringify(responseToSend, null, 4));
        }
    }

    return res.send(responseToSend);
};

const sendSuccessResponseAsAccepted = function (res, output) {
    res.status(202);
    return sendSuccessResponse(res, output);
};

export {
    sendErrorResponse,
    sendSuccessResponse,
    sendSuccessResponseAsAccepted
};
