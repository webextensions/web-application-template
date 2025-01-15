import { z } from 'zod';

const titleFieldSchema = z.string().min(1).max(100);

const taskCategoryObjectFrontendSchema = z.object({
    title: titleFieldSchema
});

export {
    titleFieldSchema,

    taskCategoryObjectFrontendSchema
};
