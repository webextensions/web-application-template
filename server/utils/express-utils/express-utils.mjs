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

const sendSuccessResponse = function (res, output) {
    const responseToSend = {
        status: 'success'
    };

    if (output !== undefined) {
        responseToSend.output = output;
    }

    return res.send(responseToSend);
};

export {
    sendErrorResponse,
    sendSuccessResponse
};
