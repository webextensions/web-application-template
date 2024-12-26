import { z } from 'zod';

const idFieldSchema       = z.string().min(3).max(40);
const nameFieldSchema     = z.string().min(3).max(100);
const emailFieldSchema    = z.string().email();
const passwordFieldSchema = z.string().min(6).max(18); // https://www.npmjs.com/package/bcrypt/v/5.1.1#security-issues-and-concerns
                                                       // 'bcrypt' only utilizes first 72 bytes (not necessarily 72 characters)
                                                       // At the time of writing this, in UTF-8, a character can be in the range of 1 byte up to 4 bytes
                                                       // Hence, limiting the password to 18 characters (18 * 4 = 72 bytes)
const joinedAtFieldSchema = z.number().int().positive();

const userObjectFrontendSchema = z.object({
    id:       idFieldSchema,
    name:     nameFieldSchema,
    email:    emailFieldSchema,
    password: passwordFieldSchema
});

const userObjectFullSchema = userObjectFrontendSchema.extend({
    joinedAt: joinedAtFieldSchema
});

export {
    idFieldSchema,
    nameFieldSchema,
    emailFieldSchema,
    passwordFieldSchema,
    joinedAtFieldSchema,

    userObjectFrontendSchema,
    userObjectFullSchema
};
