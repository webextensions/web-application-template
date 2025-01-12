import express from 'express';

import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../../utils/express/sendResponse.js';

import { UsersDal } from '../../../../database/AppDal/Users/UsersDal.js';
import { userObjectFullSchema } from '../../../../database/AppDal/Users/UsersFieldsSchema.js';

const usersRoutes = async function ({ constructorParamForUsers }) {
    const usersDal = new UsersDal(constructorParamForUsers);

    return (
        express
            .Router({ mergeParams: true })
            .get('/list', (await import('./list/list.js')).list({ constructorParamForUsers }))
            .post('/create', async function (req, res) {
                const { id, name, email, password, joinedAt } = req.body;
                const userOb = {
                    id,
                    name,
                    email,
                    password,
                    joinedAt: Number.parseInt(joinedAt)
                };

                try {
                    userObjectFullSchema.parse(userOb);
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
            .use('/:userUuid', express.Router({ mergeParams: true })
                .get('/loginAs', (await import('./loginAs/loginAs.js')).loginAs())
                .post('/setPassword', (await import('./setPassword/setPassword.js')).setPassword({ constructorParamForUsers }))
            )
    );
};

export { usersRoutes };
