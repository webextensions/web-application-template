import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../../../utils/express/sendResponse.js';

import {
    USER_UUID_COOKIE_NAME,
    USER_AUTH_COOKIE_NAME
} from '../../../../../../shared/appConstants.js';

const loginAs = function () {
    return async function (req, res) {
        const { userUuid } = req.params;
        if (!userUuid) {
            return sendErrorResponse(res, 400, 'User UUID is missing');
        }

        const uuid = userUuid;
        const currentTimestamp = Date.now();
        // Cookies have max limit of 400 days. We are using 398 days (2 days less than the maximum limit). https://chromestatus.com/feature/4887741241229312
        const expiryTimestamp = currentTimestamp + 398 * 24 * 60 * 60 * 1000;

        const issuedAt = currentTimestamp;
        const expiresAt = expiryTimestamp;
        const signed = true;
        const expires = new Date(expiryTimestamp);

        res.cookie(
            USER_UUID_COOKIE_NAME,
            { uuid },
            { expires }
            // // `sameSite: 'none', secure: true` is required for cross-site cookies. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes
            // sameSite: 'none',
            // secure: true
        );
        res.cookie(
            USER_AUTH_COOKIE_NAME,
            { uuid, issuedAt, expiresAt },
            { signed, expires }
            // // `sameSite: 'none', secure: true` is required for cross-site cookies. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes
            // sameSite: 'none',
            // secure: true
        );

        return sendSuccessResponse(res, `Logged in as user ${userUuid}`);
    };
};

export { loginAs };
