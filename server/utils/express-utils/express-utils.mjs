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
    options = { beautify: false }
) {
    const responseToSend = {
        status: 'success'
    };

    if (output !== undefined) {
        responseToSend.output = output;
    }

    if (options?.beautify) {
        return (
            res
                .header('Content-Type', 'application/json')
                // .send(JSON.stringify(responseToSend, null, '\t'))
                .send(stringifyCompact(responseToSend, { maxLength: 120, indent: 4 }))
        );
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
