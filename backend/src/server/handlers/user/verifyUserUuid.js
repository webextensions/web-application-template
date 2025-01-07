import { logger } from 'note-down';

import { sendErrorResponse } from '../../utils/express/sendResponse.js';

// eslint-disable-next-line no-unused-vars
const userLoggedInWithAdminAccount = function (req, userUuidsWithAdminAccess) {
    // TODO: Pending implementation
    return false;
};

const verifyUserUuid = function ({ _userUuidsWithAdminAccess }) {
    return async (req, res, next) => {
        const { userUuid } = req.params;
        if (!userUuid) {
            return sendErrorResponse(res, 400, 'User UUID is missing');
        }

        const signedCookies = req.signedCookies;
        const userAuthCookie = signedCookies['app_user_auth'];
        const currentTimestamp = Date.now();
        let loggedInUserUuid = null;

        if (
            userAuthCookie &&
            typeof userAuthCookie.issuedAt === 'number' &&
            typeof userAuthCookie.expiresAt === 'number' &&
            userAuthCookie.issuedAt < currentTimestamp &&
            currentTimestamp < userAuthCookie.expiresAt
        ) {
            loggedInUserUuid = userAuthCookie.uuid;
            res.locals.loggedInUserUuid = loggedInUserUuid;
        }

        if (
            req.params.userUuid &&
            loggedInUserUuid &&
            req.params.userUuid === loggedInUserUuid
        ) {
            return next(); // Let the user continue
        } else if (loggedInUserUuid && userLoggedInWithAdminAccount(req, _userUuidsWithAdminAccess)) {
            logger.warn(`Allowing admin user (uuid: ${loggedInUserUuid}) to pass through for ${req.originalUrl}`);
            return next(); // Let the user continue
        } else {
            return sendErrorResponse(res, 403, 'You do not have access to this request');
        }
    };
};

export { verifyUserUuid };
