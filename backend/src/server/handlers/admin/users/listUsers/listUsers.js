import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../../../utils/express/sendResponse.js';

import { UsersDal } from '../../../../../database/AppDal/Users/UsersDal.js';

const listUsers = function ({ constructorParamForDb }) {
    const usersDal = new UsersDal(constructorParamForDb);

    return async function (req, res) {
        const [err, users] = await usersDal.listUsers();
        if (err) {
            return sendErrorResponse(res, 500, 'Internal Server Error');
        }
        return sendSuccessResponse(res, users, { beautify: true });
    };
};

export { listUsers };
