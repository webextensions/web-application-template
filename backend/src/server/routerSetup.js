import express from 'express';

import { enabledMiddlewareOrNoop } from './utils/express/enabledMiddlewareOrNoop.js';

import { basicAuth } from './middleware/basic-auth.js';

import { getUsersConstructorParam } from '../database/AppDal/Users/getUsersConstructorParam.js';

import { whoami } from './handlers/whoami/whoami.js';

import { help } from './handlers/admin/help/help.js';
import { info } from './handlers/admin/info/info.js';
import { kill } from './handlers/admin/kill/kill.js';
import { setupDb } from './handlers/admin/setupDb/setupDb.js';
import { usersRoutes as usersRoutesForAdmin } from './handlers/admin/users/usersRoutes.js';

import { setupAccountRoutes } from './handlers/account/accountRoutes.js';
import { usersRoutes as usersRoutesForUsers } from './handlers/users/usersRoutes.js';

import { setupTaskCategoriesRoutes } from './handlers/taskCategories/taskCategories.js';

const routerSetup = async function (exp, {
    _accessSecurityConfig,
    _userUuidsWithAdminAccess,
    _databaseFilePath
}) {
    const router = express.Router();

    const constructorParamForUsers = await getUsersConstructorParam({ sqliteDbPath: _databaseFilePath });

    router
        .get('/whoami', whoami())
        .use('/admin', express.Router()
            .use(
                enabledMiddlewareOrNoop(
                    _accessSecurityConfig.limitAccess?.admin?.basicAuth?.enabled,
                    // Limit access to this route to administrators only
                    basicAuth({
                        obUsernamePassword: _accessSecurityConfig.limitAccess?.admin?.basicAuth?.obUsernamePassword || {}
                    })
                )
            )
            .get('/help', help(exp))
            .get('/info', info())
            .get('/kill', kill())
            .get('/setupDb', setupDb({ constructorParamForUsers }))
            .use('/users', usersRoutesForAdmin({ constructorParamForUsers }))
            .get('/', function (req, res) {
                res.send('TODO: Serve the /GET request for /admin');
            })
        )
        .use('/api/v1', express.Router()
            .use('/account', setupAccountRoutes({ constructorParamForUsers, _userUuidsWithAdminAccess }))
            .use('/user-account', express.Router()
                .post('/create', function (req, res) {
                    const reqBody = structuredClone(req.body);

                    // TODO: Validate whether "reqBody.username" exists or not
                    res.send(`TODO: Create a user with ID ${reqBody.username} (if available)`);
                })
            )
            .use('/users', usersRoutesForUsers({ constructorParamForUsers, _userUuidsWithAdminAccess }))
        )

        .use('/taskCategories', await setupTaskCategoriesRoutes());

    setTimeout(function () {
        // Setting up this router after a delay so that live-css server router is able to attach itself before it
        router.use(function (req, res) {
            return res.status(404).send('Page not found');
        });
    }, 1000);

    exp.use('/', router);

    return router;
};

export { routerSetup };
