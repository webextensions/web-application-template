import express from 'express';

import { listUsers } from './listUsers/listUsers.js';
import { createUser } from './createUser/createUser.js';
import { loginAs } from './loginAs/loginAs.js';
import { setPassword } from './setPassword/setPassword.js';

const usersRoutes = function ({ constructorParamForDb }) {
    return (
        express
            .Router({ mergeParams: true })
            .get('/listUsers', listUsers({ constructorParamForDb }))
            .post('/createUser', createUser({ constructorParamForDb }))
            .use('/:userUuid', express.Router({ mergeParams: true })
                .get('/loginAs', loginAs())
                .post('/setPassword', setPassword({ constructorParamForDb }))
            )
    );
};

export { usersRoutes };
