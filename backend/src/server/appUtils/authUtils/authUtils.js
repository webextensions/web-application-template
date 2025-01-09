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

export const getLoggedInUserUuidFromRequest = function (req) {
    const loggedInUserUuid = _getAuthUuidFromRequest(req, USER_AUTH_COOKIE_NAME);
    return loggedInUserUuid;
};

export const getLoggedInAdminUuidFromRequest = function (req) {
    const loggedInAdminUuid = _getAuthUuidFromRequest(req, ADMIN_AUTH_COOKIE_NAME);
    return loggedInAdminUuid;
};
