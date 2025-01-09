import { logger } from 'note-down';

import { sendErrorResponse } from '../../utils/express/sendResponse.js';

import {
    getLoggedInUserUuidFromRequest,
    getLoggedInAdminUuidFromRequest
} from '../../appUtils/authUtils/authUtils.js';

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

        const loggedInUserUuid = getLoggedInUserUuidFromRequest(req);
        if (loggedInUserUuid) {
            res.locals.loggedInUserUuid = loggedInUserUuid;
        }

        const loggedInAdminUuid = getLoggedInAdminUuidFromRequest(req);
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
