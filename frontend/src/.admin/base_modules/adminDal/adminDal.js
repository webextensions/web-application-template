import ky from 'ky';

// eslint-disable-next-line no-unused-vars
const timeout = function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// eslint-disable-next-line no-unused-vars
const ajaxGet = async function ({ url, params, retry }) {
    try {
        let clonedParams;
        if (params) {
            // Remove `undefined` values from params
            clonedParams = structuredClone(params);
            for (const key in clonedParams) {
                if (clonedParams[key] === undefined) {
                    delete clonedParams[key];
                }
            }
        }

        // Note: If `retry` is a number, then it is effectively used as `{ limit: retry }` which indicates the number of attempts to make.
        const data = await ky.get(url, { searchParams: clonedParams, retry }).json();
        return [null, data];
    } catch (err) {
        return [err];
    }
};

const ajaxPost = async function ({ url, data, retry }) {
    try {
        // Note: If `retry` is a number, then it is effectively used as `{ limit: retry }` which indicates the number of attempts to make.
        const responseData = await ky.post(url, { json: data, retry }).json();
        return [null, responseData];
    } catch (err) {
        return [err];
    }
};

export const createUser = async function ({ id, name, email, password }) {
    const [err, responseData] = await ajaxPost({
        url: '/admin/users/create',
        data: { id, name, email, password }
    });
    return [err, responseData];
};
