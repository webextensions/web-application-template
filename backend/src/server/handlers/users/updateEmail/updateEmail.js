import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../../utils/express/sendResponse.js';

import { UsersDal } from '../../../../database/AppDal/Users/UsersDal.js';

const updateEmail = function ({ constructorParamForDb }) {
    const usersDal = new UsersDal(constructorParamForDb);

    return async function (req, res) {
        const { userUuid } = req.params;
        const { email } = req.body;

        const [err] = await usersDal.updateEmail({
            uuid: userUuid,
            email
        });

        if (err) {
            switch (err.cause?.code) {
                case 'USER_NOT_FOUND': {
                    console.error('Error: User not found', userUuid);
                    return sendErrorResponse(res, 404, 'User not found');
                }

                case 'EMAIL_INVALID': {
                    console.error('Error: Email invalid', userUuid);
                    return sendErrorResponse(res, 400, 'Email invalid');
                }

                case 'EMAIL_ALREADY_IN_USE': {
                    console.error('Error: Email already in use', userUuid);
                    return sendErrorResponse(res, 400, 'Email already in use');
                }

                default: {
                    console.error('Error: Unable to update email', userUuid, err);
                    return sendErrorResponse(res, 500, 'Internal Server Error');
                }
            }
        }

        return sendSuccessResponse(res);
    };
};

export { updateEmail };
