import express from 'express';

import { verifyUserUuid } from './verifyUserUuid/verifyUserUuid.js';

import { ownInfo } from './ownInfo/ownInfo.js';
import { updatePassword } from './updatePassword/updatePassword.js';
import { updateEmail } from './updateEmail/updateEmail.js';

const usersRoutes = function ({ constructorParamForDb, _userUuidsWithAdminAccess }) {
    return (
        express.Router({ mergeParams: true })
            .use('/:userUuid', express.Router({ mergeParams: true })
                .use(verifyUserUuid({ _userUuidsWithAdminAccess }))
                .get('/ownInfo', ownInfo({ constructorParamForDb }))
                .post('/updatePassword', updatePassword({ constructorParamForDb }))
                .post('/updateEmail', updateEmail({ constructorParamForDb }))
            )
    );
};

export { usersRoutes };
