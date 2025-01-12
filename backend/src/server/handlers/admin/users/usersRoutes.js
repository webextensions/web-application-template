import express from 'express';

import { list } from './list/list.js';
import { create } from './create/create.js';
import { loginAs } from './loginAs/loginAs.js';
import { setPassword } from './setPassword/setPassword.js';

const usersRoutes = function ({ constructorParamForUsers }) {
    return (
        express
            .Router({ mergeParams: true })
            .get('/list', list({ constructorParamForUsers }))
            .post('/create', create({ constructorParamForUsers }))
            .use('/:userUuid', express.Router({ mergeParams: true })
                .get('/loginAs', loginAs())
                .post('/setPassword', setPassword({ constructorParamForUsers }))
            )
    );
};

export { usersRoutes };
