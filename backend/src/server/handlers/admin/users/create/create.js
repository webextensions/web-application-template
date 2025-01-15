import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../../../utils/express/sendResponse.js';

import { UsersDal } from '../../../../../database/AppDal/Users/UsersDal.js';
import { userObjectCreationAdminFrontendSchema } from '../../../../../database/AppDal/Users/UserFieldsSchema.js';

const create = function ({ constructorParamForDb }) {
    const usersDal = new UsersDal(constructorParamForDb);

    return async function (req, res) {
        const { id, name, email, password, joinedAt } = req.body;
        const userOb = {
            id,
            name,
            email,
            password,
            joinedAt: Number.parseInt(joinedAt)
        };

        try {
            userObjectCreationAdminFrontendSchema.parse(userOb);
        } catch (e) {
            console.error(e);
            return sendErrorResponse(res, 400, `Error: Invalid data for creating user ${JSON.stringify({ id, name, email })}`);
        }

        const [err] = await usersDal.createUser(userOb);
        if (err) {
            return sendErrorResponse(res, 500, `Error: Unable to create user ${JSON.stringify({ id, name, email })}`);
        }
        return sendSuccessResponse(res, `Success: Created user with ${JSON.stringify({ id, name, email })}`);
    };
};

export { create };
