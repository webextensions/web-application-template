import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { passwordFieldSchema } from './UsersFieldsSchema.js';

class UsersDal {
    constructor({ sqliteDb }) {
        this.db = sqliteDb;
    }

    async createTable() {
        try {
            this.db.exec(`
                CREATE TABLE users (
                    uuid     TEXT             PRIMARY KEY,
                    id       TEXT    NOT NULL UNIQUE,
                    name     TEXT    NOT NULL,
                    email    TEXT    NOT NULL UNIQUE,
                    password TEXT    NOT NULL,
                    joinedAt INTEGER NOT NULL
                )
            `);
            return [null, 'Table created successfully'];
        } catch (e) {
            console.error('Error in creating table "users"', e);
            return [e];
        }
    }

    async create({ id, name, email, password, joinedAt }) {
        try {
            const statement = this.db.prepare(`
                INSERT INTO users ( uuid,  id,  name,  email,  password,  joinedAt)
                VALUES            (@uuid, @id, @name, @email, @password, @joinedAt)
            `);
            const uuid = uuidv4();

            const passwordHash = await bcrypt.hash(password, 10);
            // // The above approach works same as below, but with implicit call to `bcrypt.genSalt()`
            // const salt = await bcrypt.genSalt(10);
            // const passwordHash = await bcrypt.hash(password, salt);

            statement.run({ uuid, id, name, email, password: passwordHash, joinedAt });
            return [null];
        } catch (e) {
            const maskedPassword = password.replaceAll(/./g, '*');
            console.error(
                'Error in inserting into "users"',
                JSON.stringify({ id, name, email, password: maskedPassword, joinedAt }),
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
                return [new Error('User not found', { cause: { code: 'USER_NOT_FOUND' } })];
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return [new Error('Password incorrect', { cause: { code: 'PASSWORD_INCORRECT' } })];
            }

            const userObjectToRespondWith = {
                uuid: user.uuid,
                id: user.id
            };
            return [null, userObjectToRespondWith];
        } catch (e) {
            console.error('Error in authenticating user by accountId and password', accountId, e);
            return [e];
        }
    }

    async changePassword({ uuid, oldPassword, newPassword }) {
        try {
            const statement = this.db.prepare(`SELECT * FROM users WHERE uuid = ?`);
            const user = statement.get(uuid);
            if (!user) {
                return [new Error('User not found', { cause: { code: 'USER_NOT_FOUND' } })];
            }

            const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
            if (!isOldPasswordCorrect) {
                return [new Error('Password incorrect', { cause: { code: 'OLD_PASSWORD_INCORRECT' } })];
            }

            const newPasswordHash = await bcrypt.hash(newPassword, 10);

            try {
                passwordFieldSchema.parse(newPassword);
            } catch (e) {
                return [new Error('New password does not meet policy', { cause: { code: 'NEW_PASSWORD_DOES_NOT_MEET_POLICY' } })];
            }

            const updateStatement = this.db.prepare(`UPDATE users SET password = ? WHERE uuid = ?`);
            updateStatement.run(newPasswordHash, uuid);
            return [null];
        } catch (e) {
            console.error('Error in changing password for user with UUID', { uuid }, e);
            return [e];
        }
    }

    async getUserByUuid({ uuid }) {
        try {
            const statement = this.db.prepare(`SELECT uuid, id, name, email, joinedAt FROM users WHERE uuid = ?`);

            const result = statement.get(uuid);
            return [null, result];
        } catch (e) {
            console.error('Error in getting user by uuid', uuid, e);
            return [e];
        }
    }

    async selectAll() {
        try {
            const statement = this.db.prepare(`SELECT * FROM users`);
            const result = statement.all();
            return [null, result];
        } catch (e) {
            return [e];
        }
    }
}

export { UsersDal };
