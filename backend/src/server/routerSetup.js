import express from 'express';

import { enabledMiddlewareOrNoop } from './utils/express/enabledMiddlewareOrNoop.js';

import { basicAuth } from './middleware/basic-auth.js';

import { getUsersConstructorParam } from '../database/AppDal/Users/getUsersConstructorParam.js';

const routerSetup = async function (exp, {
    _accessSecurityConfig,
    _userUuidsWithAdminAccess,
    _databaseFilePath
}) {
    const router = express.Router();

    const constructorParamForUsers = await getUsersConstructorParam({ sqliteDbPath: _databaseFilePath });

    router
        .get('/whoami', (await import('./handlers/whoami/whoami.js')).whoami())
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
            .get('/help', (await import('./handlers/admin/help/help.js')).help(exp))
            .get('/info', (await import('./handlers/admin/info/info.js')).info())
            .get('/kill', (await import('./handlers/admin/kill/kill.js')).kill())
            .get('/setupDb', (await import('./handlers/admin/setupDb/setupDb.js')).setupDb({ constructorParamForUsers }))
            .use('/users', (await import('./handlers/admin/users/usersRoutes.js')).usersRoutes({ constructorParamForUsers }))
            .get('/', function (req, res) {
                res.send('TODO: Serve the /GET request for /admin');
            })
        )
        .use('/api/v1', express.Router()
            .use('/account', (await import('./handlers/account/accountRoutes.js')).setupAccountRoutes({ constructorParamForUsers, _userUuidsWithAdminAccess }))
            .use('/user-account', express.Router()
                .post('/create', function (req, res) {
                    const reqBody = structuredClone(req.body);

                    // TODO: Validate whether "reqBody.username" exists or not
                    res.send(`TODO: Create a user with ID ${reqBody.username} (if available)`);
                })
            )
            .use('/users', (await import('./handlers/users/usersRoutes.js')).usersRoutes({ constructorParamForUsers, _userUuidsWithAdminAccess }))
        )

        .use('/taskCategories', await (await import('./handlers/taskCategories/taskCategories.js')).setupTaskCategoriesRoutes());

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
