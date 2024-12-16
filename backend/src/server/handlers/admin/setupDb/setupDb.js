import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../../utils/express/sendResponse.js';

import { UsersDal } from '../../../../database/AppDal/Users/UsersDal.js';

const setupDb = function ({ constructorParamForUsers }) {
    const usersDal = new UsersDal(constructorParamForUsers);

    return async function (req, res) {
        const [errUsers] = await usersDal.createTable();

        if (errUsers) {
            console.error('Error in creating "users" table', errUsers);
            return sendErrorResponse(res, 500, 'Error in creating "users" table');
        }

        console.info('Table(s) created successfully');
        return sendSuccessResponse(res, 'Table(s) created successfully');
    };
};

export { setupDb };
