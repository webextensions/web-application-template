import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

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

    async getUserByUuid({ uuid }) {
        try {
            const statement = this.db.prepare(`SELECT * FROM users WHERE uuid = ?`);
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
