import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import {
    passwordFieldSchema,
    emailFieldSchema
} from './UserFieldsSchema.js';

class UsersDal {
    constructor({ sqliteDb }) {
        this.db = sqliteDb;
    }

    async createTable_users() {
        try {
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS users (
                    uuid         TEXT             PRIMARY KEY,
                    id           TEXT    NOT NULL UNIQUE,
                    name         TEXT    NOT NULL,
                    email        TEXT    NOT NULL UNIQUE,
                    passwordHash TEXT    NOT NULL,
                    joinedAt     INTEGER NOT NULL
                )
            `);
            return [null, 'Success: Created table "users"'];
        } catch (e) {
            console.error('Error: Failed to create table "users"', e);
            return [e];
        }
    }

    async createUser({ id, name, email, password, joinedAt }) {
        try {
            const uuid = uuidv4();

            const passwordHash = await bcrypt.hash(password, 10);
            // // The above approach works same as below, but with implicit call to `bcrypt.genSalt()`
            // const salt = await bcrypt.genSalt(10);
            // const passwordHash = await bcrypt.hash(password, salt);

            const statement = this.db.prepare(`
                INSERT INTO users ( uuid,  id,  name,  email,  passwordHash,  joinedAt)
                VALUES            (@uuid, @id, @name, @email, @passwordHash, @joinedAt)
            `);
            statement.run({         uuid,  id,  name,  email,  passwordHash,  joinedAt });
            return [null];
        } catch (e) {
            const maskedPassword = password.replaceAll(/./g, '*');
            console.error(
                'Error: Failed to insert record into "users"',
                JSON.stringify({ id, name, email, maskedPassword, joinedAt }),
                e
            );
            return [e];
        }
    }

    async authenticateUserByAccountIdAndPassword({ accountId, password }) {
        try {
            const statement = this.db.prepare(`SELECT * FROM users WHERE id = ?`);
            const user = statement.get(accountId);
            if (!user) {
                return [new Error('Error: User not found', { cause: { code: 'USER_NOT_FOUND' } })];
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordCorrect) {
                return [new Error('Error: Password incorrect', { cause: { code: 'PASSWORD_INCORRECT' } })];
            }

            const userObjectToRespondWith = {
                uuid: user.uuid,
                id: user.id
            };
            return [null, userObjectToRespondWith];
        } catch (e) {
            console.error('Error: Failed to authenticate user by accountId and password', accountId, e);
            return [e];
        }
    }

    async setPassword({ uuid, newPassword }) {
        try {
            const statement = this.db.prepare(`SELECT * FROM users WHERE uuid = ?`);
            const user = statement.get(uuid);
            if (!user) {
                return [new Error('Error: User not found', { cause: { code: 'USER_NOT_FOUND' } })];
            }

            try {
                passwordFieldSchema.parse(newPassword);
            } catch (e) {
                return [new Error('Error: New password does not meet policy', { cause: { code: 'NEW_PASSWORD_DOES_NOT_MEET_POLICY' } })];
            }

            const newPasswordHash = await bcrypt.hash(newPassword, 10);
            const updateStatement = this.db.prepare(`UPDATE users SET passwordHash = ? WHERE uuid = ?`);
            updateStatement.run(newPasswordHash, uuid);

            return [null];
        } catch (e) {
            console.error('Error: Failed to set password for user with UUID', { uuid }, e);
            return [e];
        }
    }

    async updatePassword({ uuid, oldPassword, newPassword }) {
        try {
            const statement = this.db.prepare(`SELECT * FROM users WHERE uuid = ?`);
            const user = statement.get(uuid);
            if (!user) {
                return [new Error('Error: User not found', { cause: { code: 'USER_NOT_FOUND' } })];
            }

            const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.passwordHash);
            if (!isOldPasswordCorrect) {
                return [new Error('Error: Password incorrect', { cause: { code: 'OLD_PASSWORD_INCORRECT' } })];
            }

            try {
                passwordFieldSchema.parse(newPassword);
            } catch (e) {
                return [new Error('Error: New password does not meet policy', { cause: { code: 'NEW_PASSWORD_DOES_NOT_MEET_POLICY' } })];
            }

            const newPasswordHash = await bcrypt.hash(newPassword, 10);
            const updateStatement = this.db.prepare(`UPDATE users SET passwordHash = ? WHERE uuid = ?`);
            updateStatement.run(newPasswordHash, uuid);

            return [null];
        } catch (e) {
            console.error('Error: Failed to change password for user with UUID', { uuid }, e);
            return [e];
        }
    }

    async updateEmail({ uuid, email }) {
        try {
            const statement = this.db.prepare(`SELECT * FROM users WHERE uuid = ?`);
            const user = statement.get(uuid);
            if (!user) {
                return [new Error('Error: User not found', { cause: { code: 'USER_NOT_FOUND' } })];
            }

            try {
                emailFieldSchema.parse(email);
            } catch (e) {
                return [new Error('Error: Email invalid', { cause: { code: 'EMAIL_INVALID' } })];
            }

            const existingUserWithNewEmail = this.db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
            if (existingUserWithNewEmail) {
                return [new Error('Error: Email already in use', { cause: { code: 'EMAIL_ALREADY_IN_USE' } })];
            }

            const updateStatement = this.db.prepare(`UPDATE users SET email = ? WHERE uuid = ?`);
            updateStatement.run(email, uuid);

            return [null];
        } catch (e) {
            console.error('Error: Failed to change email for user with UUID', { uuid }, e);
            return [e];
        }
    }

    async getUserByUuid({ uuid }) {
        try {
            const statement = this.db.prepare(`SELECT uuid, id, name, email, joinedAt FROM users WHERE uuid = ?`);

            const result = statement.get(uuid);
            return [null, result];
        } catch (e) {
            console.error('Error: Failed to get record by "uuid" from table "users"', uuid, e);
            return [e];
        }
    }

    async listUsers() {
        try {
            const statement = this.db.prepare(`SELECT * FROM users`);
            const result = statement.all();
            return [null, result];
        } catch (e) {
            console.error('Error: Failed to list records from table "users"', e);
            return [e];
        }
    }
}

export { UsersDal };
