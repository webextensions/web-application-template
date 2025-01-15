import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../../utils/express/sendResponse.js';

import { UsersDal } from '../../../../database/AppDal/Users/UsersDal.js';
import { TasksDal } from '../../../../database/AppDal/Tasks/TasksDal.js';

const setupDb = function ({ constructorParamForDb }) {
    const usersDal = new UsersDal(constructorParamForDb);
    const tasksDal = new TasksDal(constructorParamForDb);

    return async function (req, res) {
        const [errUsers] = await usersDal.createTable_users();
        if (errUsers) {
            console.error('Error: Failed to create "users" table', errUsers);
            return sendErrorResponse(res, 500, 'Error: Unable to create "users" table');
        }

        const [errTasks] = await tasksDal.createTable_taskCategories();
        if (errTasks) {
            console.error('Error: Failed to create "taskCategories" table', errTasks);
            return sendErrorResponse(res, 500, 'Error: Unable to create "taskCategories" table');
        }

        const [errTasksIndexes, statusTasksIndexes] = await tasksDal.ensureIndexes_taskCategories();
        if (errTasksIndexes) {
            console.error('Error: Failed to ensure indexes for "taskCategories" table', errTasksIndexes, statusTasksIndexes);
            return sendErrorResponse(res, 500, 'Error: Unable to ensure indexes for "taskCategories" table');
        }

        console.info('Success: Tables and indexes have been ensured/created');
        return sendSuccessResponse(res, 'Success: Tables and indexes have been ensured/created');
    };
};

export { setupDb };
