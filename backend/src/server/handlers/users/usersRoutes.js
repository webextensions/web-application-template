import express from 'express';

import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../utils/express/sendResponse.js';

import { UsersDal } from '../../../database/AppDal/Users/UsersDal.js';

import { verifyUserUuid } from './verifyUserUuid.js';

import { updatePassword } from './updatePassword/updatePassword.js';
import { updateEmail } from './updateEmail/updateEmail.js';

const setupUsersRoutes = function ({ constructorParamForUsers, _userUuidsWithAdminAccess }) {
    const usersDal = new UsersDal(constructorParamForUsers);

    return (
        express.Router({ mergeParams: true })
            .use('/:userUuid', express.Router({ mergeParams: true })
                .use(verifyUserUuid({ _userUuidsWithAdminAccess }))
                .get('/owninfo', async function (req, res) {
                    const { userUuid } = req.params;

                    const [err, user] = await usersDal.getUserByUuid({ uuid: userUuid });
                    if (err) {
                        return sendErrorResponse(res, 500, 'Internal Server Error');
                    } else if (!user) {
                        return sendErrorResponse(res, 404, 'User not found');
                    }
                    return sendSuccessResponse(res, user);
                })
                .post('/updatePassword', updatePassword({ constructorParamForUsers }))
                .post('/updateEmail', updateEmail({ constructorParamForUsers }))
            )
    );
};

export { setupUsersRoutes };
