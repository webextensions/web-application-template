const enabledMiddlewareOrNoop = function (enabled, middleware) {
    if (enabled) {
        return middleware;
    } else {
        return function (req, res, next) {
            next();
        };
    }
};

export { enabledMiddlewareOrNoop };
