// Helpful for converting the [err, data] (array-based) safe promise to error-based promise
// Required for `@tanstack/react-query`
const safeArrayPromiseToErrorPromise = function (p) {
    const promise = new Promise((resolve, reject) => {
        p.then(([err, data]) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
    return promise;
};

export { safeArrayPromiseToErrorPromise };
