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
            console.error('Error in creating "users" table', errUsers);
            return sendErrorResponse(res, 500, 'Error: Unable to create "users" table');
        }

        const [errTasks] = await tasksDal.createTable_taskCategories();
        if (errTasks) {
            console.error('Error in creating "taskCategories" table', errTasks);
            return sendErrorResponse(res, 500, 'Error: Unable to create "taskCategories" table');
        }

        console.info('Success: Tables created/ensured successfully');
        return sendSuccessResponse(res, 'Success: Tables created/ensured successfully');
    };
};

export { setupDb };
