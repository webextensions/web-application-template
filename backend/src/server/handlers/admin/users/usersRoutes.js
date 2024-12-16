import express from 'express';

import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../../utils/express/sendResponse.js';

import { UsersDal } from '../../../../database/AppDal/Users/UsersDal.js';
import { userObjectSchema } from '../../../../database/AppDal/Users/UsersFieldsSchema.js';

const setupUsersRoutes = function ({ constructorParamForUsers }) {
    const usersDal = new UsersDal(constructorParamForUsers);

    return (
        express
            .Router({ mergeParams: true })
            .get('/list', async function (req, res) {
                const [err, users] = await usersDal.selectAll();
                if (err) {
                    return res.status(500).json({
                        status: 'error',
                        error: 'Internal Server Error'
                    });
                }
                return sendSuccessResponse(res, users, { beautify: true });
            })
            .post('/create', async function (req, res) {
                const { id, name, email, password } = req.body;
                const userOb = { id, name, email, password };

                try {
                    userObjectSchema.parse(userOb);
                } catch (e) {
                    console.error(e);
                    return sendErrorResponse(res, 400, `Error in creating user ${JSON.stringify(req.body)}`);
                }

                const [err] = await usersDal.create(userOb);
                if (err) {
                    return sendErrorResponse(res, 500, `Error in creating user ${JSON.stringify(req.body)}`);
                }
                return sendSuccessResponse(res, 'User created successfully');
            })
    );
};

export { setupUsersRoutes };
