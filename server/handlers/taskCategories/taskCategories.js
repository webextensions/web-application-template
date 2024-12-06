import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';

import Datastore from '@seald-io/nedb';
import {
    sendErrorResponse,
    sendSuccessResponse
} from '../../utils/express/sendResponse.js';

import notifier from '../../../utils/notifications/notifications.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dbFilePath = path.resolve(__dirname, '../../../app-data/taskCategories.db');
const db = new Datastore({
    filename: dbFilePath,
    autoload: true
});

const setupTaskCategoriesRoutes = async function () {
    await db.loadDatabaseAsync();
    try {
        await db.ensureIndexAsync({ fieldName: 'title', unique: true });
        console.info('Ensured index on "title" field for database at', dbFilePath);
    } catch (e) {
        console.error(e);
        notifier.error('Error in Ensure Index', `Could not ensure index on "title" field for database at ${dbFilePath}`);
        throw e;
    }

    const router = (
        express.Router()
            .get('/list', async function (req, res) {
                const entries = await db.find({}).sort({ title: 1 });
                return sendSuccessResponse(res, entries);
            })
            .get('/count', async function (req, res) {
                const count = await db.countAsync({});
                return sendSuccessResponse(res, count);
            })
            .post('/create', async function (req, res) {
                try {
                    const input = req.body;

                    const taskCategory = {
                        ...input,
                        createdAt: new Date()
                    };

                    const newDoc = await db.insertAsync(taskCategory);
                    return sendSuccessResponse(res, newDoc);
                } catch (err) {
                    if (err.errorType === 'uniqueViolated') {
                        return sendErrorResponse(res, 409, 'Task category already exists');
                    } else {
                        console.error(err);
                        return sendErrorResponse(res, 500, 'Internal Server Error');
                    }
                }
            })
            .post('/delete/:taskCategoryId', async function (req, res) {
                try {
                    const { taskCategoryId } = req.params;
                    const numRemoved = await db.removeAsync({ _id: taskCategoryId }, { multi: false });
                    return sendSuccessResponse(res, numRemoved);
                } catch (err) {
                    console.error(err);
                    return sendErrorResponse(res, 500, 'Internal Server Error');
                }
            })
    );

    return router;
};

export { setupTaskCategoriesRoutes };
