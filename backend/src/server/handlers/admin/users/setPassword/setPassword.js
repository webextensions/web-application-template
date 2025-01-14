import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../../../utils/express/sendResponse.js';

import { UsersDal } from '../../../../../database/AppDal/Users/UsersDal.js';

const setPassword = function ({ constructorParamForDb }) {
    const usersDal = new UsersDal(constructorParamForDb);

    return async function (req, res) {
        const { userUuid } = req.params;
        const { newPassword } = req.body;

        const [err] = await usersDal.setPassword({
            uuid: userUuid,
            newPassword
        });

        if (err) {
            switch (err.cause?.code) {
                case 'USER_NOT_FOUND': {
                    console.error('Error: User not found', userUuid);
                    return sendErrorResponse(res, 404, 'User not found');
                }
                case 'NEW_PASSWORD_DOES_NOT_MEET_POLICY': {
                    console.error('Error: New password does not meet policy', userUuid);
                    return sendErrorResponse(res, 400, 'New password does not meet policy');
                }
                default: {
                    console.error('Error: Unable to set password', userUuid, err);
                    return sendErrorResponse(res, 500, 'Internal Server Error');
                }
            }
        }
        return sendSuccessResponse(res, 'Password set successfully');
    };
};

export { setPassword };
