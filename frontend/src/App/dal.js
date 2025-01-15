import ky from 'ky';

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const kyForApp = {
    // Setting `ky` instance internally, so that it can be updated in runtime (for development / debugging / testing purposes)
    instance: ky.create({
        timeout: 30000
    })
};

export const getDummyJsonData = async () => {
    await timeout(2000);
    return [null, {
        type: 'dummy',
        name: 'John Doe'
    }];
};

export const listTaskCategories = async () => {
    try {
        const response = await kyForApp.instance.get('/taskCategories/listCategories');
        const json = await response.json();
        return [null, json.output];
    } catch (err) {
        return [err, null];
    }
};

export const countTaskCategories = async () => {
    try {
        const response = await kyForApp.instance.get('/taskCategories/countCategories');
        const json = await response.json();
        return [null, json.output];
    } catch (err) {
        return [err, null];
    }
};

export const createTaskCategory = async (title) => {
    try {
        const response = await kyForApp.instance.post('/taskCategories/createCategory', {
            json: {
                title
            }
        });
        const json = await response.json();
        return [null, json.output];
    } catch (err) {
        return [err, null];
    }
};

export const deleteTaskCategory = async (taskId) => {
    try {
        const response = await kyForApp.instance.post(`/taskCategories/deleteCategory/${taskId}`);
        const json = await response.json();
        return [null, json.output];
    } catch (err) {
        return [err, null];
    }
};

export const loginWithAccountIdAndPassword = async ({ accountId, password }) => {
    try {
        const response = await kyForApp.instance.post('/api/v1/account/login', {
            json: {
                accountId,
                password
            }
        });
        const json = await response.json();
        return [null, json.output];
    } catch (err) {
        return [err, null];
    }
};

export const getProfileForLoggedInUserByUserUuid = async (userUuid) => {
    try {
        const response = await kyForApp.instance.get(`/api/v1/users/${userUuid}/ownInfo`);
        const json = await response.json();
        return [null, json.output];
    } catch (err) {
        return [err, null];
    }
};
