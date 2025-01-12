import express from 'express';

const usersRoutes = async function ({ constructorParamForUsers }) {
    return (
        express
            .Router({ mergeParams: true })
            .get('/list', (await import('./list/list.js')).list({ constructorParamForUsers }))
            .post('/create', (await import('./create/create.js')).create({ constructorParamForUsers }))
            .use('/:userUuid', express.Router({ mergeParams: true })
                .get('/loginAs', (await import('./loginAs/loginAs.js')).loginAs())
                .post('/setPassword', (await import('./setPassword/setPassword.js')).setPassword({ constructorParamForUsers }))
            )
    );
};

export { usersRoutes };
