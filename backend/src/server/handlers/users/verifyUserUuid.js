import { logger } from 'note-down';

import { sendErrorResponse } from '../../utils/express/sendResponse.js';

import {
    USER_AUTH_COOKIE_NAME,
    ADMIN_AUTH_COOKIE_NAME
} from '../../../../shared/appConstants.js';

const _getAuthUuidFromRequest = function (req, authCookieName) {
    const signedCookies = req.signedCookies;
    const authCookie = signedCookies[authCookieName];
    const currentTimestamp = Date.now();
    let authUuid = null;

    if (
        authCookie &&
        typeof authCookie.issuedAt === 'number' &&
        typeof authCookie.expiresAt === 'number' &&
        authCookie.issuedAt < currentTimestamp &&
        currentTimestamp < authCookie.expiresAt &&
        authCookie.uuid &&
        authCookie.uuid.length === 36
    ) {
        authUuid = authCookie.uuid;
    }

    return authUuid;
};

const _getLoggedInUserUuidFromRequest = function (req) {
    const loggedInUserUuid = _getAuthUuidFromRequest(req, USER_AUTH_COOKIE_NAME);
    return loggedInUserUuid;
};

const _getLoggedInAdminUuidFromRequest = function (req) {
    const loggedInAdminUuid = _getAuthUuidFromRequest(req, ADMIN_AUTH_COOKIE_NAME);
    return loggedInAdminUuid;
};

const userLoggedInWithAdminAccount = function (loggedInAdminUuid, _userUuidsWithAdminAccess) {
    if (
        loggedInAdminUuid && // Checking just for some robustness (against future changes)
        _userUuidsWithAdminAccess.includes(loggedInAdminUuid)
    ) {
        return true;
    } else {
        return false;
    }
};

const verifyUserUuid = function ({ _userUuidsWithAdminAccess }) {
    return async (req, res, next) => {
        const { userUuid } = req.params;
        if (!userUuid) {
            return sendErrorResponse(res, 400, 'User UUID is missing');
        }

        const loggedInUserUuid = _getLoggedInUserUuidFromRequest(req);
        if (loggedInUserUuid) {
            res.locals.loggedInUserUuid = loggedInUserUuid;
        }

        const loggedInAdminUuid = _getLoggedInAdminUuidFromRequest(req);
        if (loggedInAdminUuid) {
            res.locals.loggedInAdminUuid = loggedInAdminUuid;
        }

        if (
            loggedInUserUuid &&
            userUuid === loggedInUserUuid
        ) {
            return next(); // Let the user continue
        } else if (
            loggedInAdminUuid &&
            userLoggedInWithAdminAccount(loggedInAdminUuid, _userUuidsWithAdminAccess)
        ) {
            logger.warn(`Allowing admin user (uuid: ${loggedInUserUuid}) to pass through for ${req.originalUrl}`);
            return next(); // Let the admin continue
        } else {
            return sendErrorResponse(res, 403, 'You do not have access to this request');
        }
    };
};

export { verifyUserUuid };
