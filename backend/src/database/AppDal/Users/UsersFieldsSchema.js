import { z } from 'zod';

const idFieldSchema       = z.string().min(3).max(40);
const nameFieldSchema     = z.string().min(3).max(100);
const emailFieldSchema    = z.string().email();
const passwordFieldSchema = z.string().min(6).max(100);

const userObjectSchema = z.object({
    id:       idFieldSchema,
    name:     nameFieldSchema,
    email:    emailFieldSchema,
    password: passwordFieldSchema
});

export {
    idFieldSchema,
    nameFieldSchema,
    emailFieldSchema,
    passwordFieldSchema,

    userObjectSchema
};
