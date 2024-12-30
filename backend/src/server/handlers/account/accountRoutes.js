import express from 'express';

import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../utils/express/sendResponse.js';

import { UsersDal } from '../../../database/AppDal/Users/UsersDal.js';

import {
    USER_UUID_COOKIE_NAME,
    USER_AUTH_COOKIE_NAME
} from '../../../../../backend/shared/appConstants.js';

const setCookiesForSuccessfulAuthentication = function (res, user) {
    const uuidOfLoggedInUser = user.uuid;
    const currentTimestamp = Date.now();
    // Cookies have max limit of 400 days. We are using 398 days (2 days less than the maximum limit). https://chromestatus.com/feature/4887741241229312
    const expiryTimestamp = currentTimestamp + 398 * 24 * 60 * 60 * 1000;

    res.cookie(
        USER_UUID_COOKIE_NAME,
        { uuid: uuidOfLoggedInUser },
        {
            expires: new Date(expiryTimestamp)

            // // `sameSite: 'none', secure: true` is required for cross-site cookies. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes
            // sameSite: 'none',
            // secure: true
        }
    );
    res.cookie(
        USER_AUTH_COOKIE_NAME,
        {
            uuid: uuidOfLoggedInUser,
            issuedAt: currentTimestamp,
            expiresAt: expiryTimestamp
        },
        {
            signed: true,
            expires: new Date(expiryTimestamp)

            // // `sameSite: 'none', secure: true` is required for cross-site cookies. https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes
            // sameSite: 'none',
            // secure: true
        }
    );
};

const setupAccountRoutes = function ({ constructorParamForUsers }) {
    const usersDal = new UsersDal(constructorParamForUsers);

    return (
        express.Router({ mergeParams: true })
            .post('/login', async function (req, res) {
                const { accountId, password } = req.body;

                if (!accountId || !password) {
                    return sendErrorResponse(res, 400, 'Bad Request');
                }

                const [err, user] = await usersDal.authenticateUserByAccountIdAndPassword({ accountId, password });
                if (err) {
                    if (err.cause?.code === 'USER_NOT_FOUND') {
                        console.error('Error: User not found', accountId);
                        return sendErrorResponse(res, 404, 'User not found');
                    } else if (err.cause?.code === 'PASSWORD_INCORRECT') {
                        console.error('Error: Password incorrect', accountId);
                        return sendErrorResponse(res, 401, 'Unauthorized');
                    } else {
                        console.error('Error: Unable to authenticate user by accountId and password', accountId, err);
                        return sendErrorResponse(res, 500, 'Internal Server Error');
                    }
                }

                setCookiesForSuccessfulAuthentication(res, user);
                return sendSuccessResponse(res, user);
            })
    );
};

export { setupAccountRoutes };
