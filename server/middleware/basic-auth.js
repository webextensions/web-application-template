// References:
//     https://www.taniarascia.com/basic-authentication-for-an-express-node-app-htpasswd/
//     https://www.npmjs.com/package/basic-auth

const auth = require('basic-auth');
// const packageName = require('../../package.json').name;

const obUsernamePassword = {
    Username: 'Password' // TODO: Move this object to config
};

const basicAuth = function (options) {
    options = options || {};
    const skipPaths = options.skipPaths || [];
    return function (req, res, next) {
        const skipAuthForThisRequest = skipPaths.some(function (skipPath) {
            if (req.originalUrl.match(skipPath)) {
                return true;
            }
            return false;
        });
        if (skipAuthForThisRequest) {
            return next();
        } else {
            const credentials = auth(req);
            let userHasAccess = false;

            if (
                credentials &&
                credentials.name &&
                obUsernamePassword[credentials.name] &&
                credentials.pass &&
                (credentials.pass === obUsernamePassword[credentials.name])
            ) {
                userHasAccess = true;
            }

            if (userHasAccess) {
                return next();
            } else {
                res.set('WWW-Authenticate', `Basic`);
                // res.set('WWW-Authenticate', `Basic realm="${packageName}"`);
                return res.status(401).send();
            }
        }
    };
};

module.exports = basicAuth;
