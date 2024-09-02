const errAndDataArrayToPromise = function (fn, params = []) {
    return new Promise((resolve, reject) => {
        (async () => {
            const [err, data] = await fn(...params);
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })();
    });
};

export { errAndDataArrayToPromise };
