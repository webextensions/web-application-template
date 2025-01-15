import express from 'express';

import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../utils/express/sendResponse.js';

import { TasksDal } from '../../../database/AppDal/Tasks/TasksDal.js';
import { taskCategoryObjectFrontendSchema } from '../../../database/AppDal/Tasks/TaskCategoryFieldsSchema.js';

const taskCategoriesRoutes = function ({ constructorParamForDb }) {
    const tasksDal = new TasksDal(constructorParamForDb);

    return (
        express.Router()
            .get('/listCategories', async function (req, res) {
                const [err, tasks] = await tasksDal.listCategories();
                if (err) {
                    return sendErrorResponse(res, 500, 'Internal Server Error');
                } else {
                    return sendSuccessResponse(res, tasks, { beautify: true });
                }
            })
            .get('/countCategories', async function (req, res) {
                const [err, count] = await tasksDal.countCategories();
                if (err) {
                    return sendErrorResponse(res, 500, 'Internal Server Error');
                } else {
                    return sendSuccessResponse(res, count);
                }
            })
            .post('/createCategory', async function (req, res) {
                const { title } = req.body;

                const taskCategoryOb = { title };

                try {
                    taskCategoryObjectFrontendSchema.parse(taskCategoryOb);
                } catch (e) {
                    console.error(e);
                    return sendErrorResponse(res, 400, `Error: Invalid data for creating task category with title "${title}"`);
                }

                taskCategoryOb.createdAt = Date.now();

                const [err] = await tasksDal.createCategory(taskCategoryOb);
                if (err) {
                    return sendErrorResponse(res, 500, `Error: Unable to create task category with title "${title}"`);
                }

                return sendSuccessResponse(res, `Success: Created task category with title "${title}"`);
            })
            .post('/deleteCategory/:taskCategoryId', async function (req, res) {
                const { taskCategoryId } = req.params;

                const [err, recordsDeletedCount] = await tasksDal.deleteCategories({ id: taskCategoryId });

                if (err) {
                    return sendErrorResponse(res, 500, `Error: Unable to delete task category with id ${taskCategoryId}`);
                }

                if (recordsDeletedCount === 0) {
                    return sendErrorResponse(res, 404, `Error: No task category found with id ${taskCategoryId}`);
                }

                return sendSuccessResponse(res, `Success: Deleted task category with id ${taskCategoryId}`);
            })
    );
};

export { taskCategoriesRoutes };
