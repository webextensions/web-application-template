import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../../utils/express/sendResponse.js';

import { UsersDal } from '../../../../database/AppDal/Users/UsersDal.js';

const updatePassword = function ({ constructorParamForUsers }) {
    const usersDal = new UsersDal(constructorParamForUsers);

    return async function (req, res) {
        const { userUuid } = req.params;
        const { oldPassword, newPassword } = req.body;

        const [err] = await usersDal.updatePassword({
            uuid: userUuid,
            oldPassword,
            newPassword
        });

        if (err) {
            switch (err.cause?.code) {
                case 'USER_NOT_FOUND': {
                    console.error('Error: User not found', userUuid);
                    return sendErrorResponse(res, 404, 'User not found');
                }

                case 'OLD_PASSWORD_INCORRECT': {
                    console.error('Error: Old password incorrect', userUuid);
                    return sendErrorResponse(res, 401, 'Invalid old password');
                }

                // // TODO: Uncomment this case when/if the 'NEW_PASSWORD_SAME_AS_OLD' related functionality is implemented
                // case 'NEW_PASSWORD_SAME_AS_OLD': {
                //     console.error('Error: New password is same as old password', userUuid);
                //     return sendErrorResponse(res, 400, 'New password is same as old password');
                // }

                case 'NEW_PASSWORD_DOES_NOT_MEET_POLICY': {
                    console.error('Error: New password does not meet policy', userUuid);
                    return sendErrorResponse(res, 400, 'New password does not meet policy');
                }
                // // TODO: Uncomment this case when/if the 'PASSWORD_WEAK' related functionality is implemented
                // //       Note: 'PASSWORD_WEAK' may be a sub-case of 'NEW_PASSWORD_DOES_NOT_MEET_POLICY'
                // case 'PASSWORD_WEAK': {
                //     console.error('Error: New password is weak', userUuid);
                //     return sendErrorResponse(res, 400, 'New password is weak');
                // }

                // // TODO: Uncomment this case when/if the 'PASSWORD_RESET_REQUIRED' related functionality is implemented
                // case 'PASSWORD_RESET_REQUIRED': {
                //     console.error('Error: Password reset required', userUuid);
                //     return sendErrorResponse(res, 400, 'Password reset required');
                // }

                default: {
                    console.error('Error: Unable to update password', userUuid, err);
                    return sendErrorResponse(res, 500, 'Internal Server Error');
                }
            }
        } else {
            return sendSuccessResponse(res, 'Password updated successfully');
        }
    };
};

export { updatePassword };
