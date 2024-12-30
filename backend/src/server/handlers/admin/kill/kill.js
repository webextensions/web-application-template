import { sendSuccessResponse } from '../../../utils/express/sendResponse.js';

const kill = function () {
    return async (req, res) => {
        setTimeout(() => {
            // eslint-disable-next-line n/no-process-exit
            process.exit(1);
        }, 1000);

        const message = 'Registered kill request. The server will be killed after 1 second.';
        console.warn(message);
        return sendSuccessResponse(res, message);
    };
};

export { kill };
