import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../../../utils/express/sendResponse.js';

import { UsersDal } from '../../../../../database/AppDal/Users/UsersDal.js';

const list = function ({ constructorParamForUsers }) {
    const usersDal = new UsersDal(constructorParamForUsers);

    return async function (req, res) {
        const [err, users] = await usersDal.selectAll();
        if (err) {
            return sendErrorResponse(res, 500, 'Internal Server Error');
        }
        return sendSuccessResponse(res, users, { beautify: true });
    };
};

export { list };
