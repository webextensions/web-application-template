import express from 'express';

import { verifyUserUuid } from './verifyUserUuid.js';

import { ownInfo } from './ownInfo/ownInfo.js';
import { updatePassword } from './updatePassword/updatePassword.js';
import { updateEmail } from './updateEmail/updateEmail.js';

const setupUsersRoutes = function ({ constructorParamForUsers, _userUuidsWithAdminAccess }) {
    return (
        express.Router({ mergeParams: true })
            .use('/:userUuid', express.Router({ mergeParams: true })
                .use(verifyUserUuid({ _userUuidsWithAdminAccess }))
                .get('/ownInfo', ownInfo({ constructorParamForUsers }))
                .post('/updatePassword', updatePassword({ constructorParamForUsers }))
                .post('/updateEmail', updateEmail({ constructorParamForUsers }))
            )
    );
};

export { setupUsersRoutes };
