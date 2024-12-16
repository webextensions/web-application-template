import { v4 as uuidv4 } from 'uuid';

class UsersDal {
    constructor({ sqliteDb }) {
        this.db = sqliteDb;
    }

    async createTable() {
        try {
            this.db.exec(`
                CREATE TABLE users (
                    uuid     TEXT          PRIMARY KEY,
                    id       TEXT NOT NULL UNIQUE,
                    name     TEXT NOT NULL,
                    email    TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL
                )
            `);
            return [null, 'Table created successfully'];
        } catch (e) {
            console.error('Error in creating table "users"', e);
            return [e];
        }
    }

    async create({ id, name, email, password }) {
        const uuid = uuidv4();
        try {
            const statement = this.db.prepare(`
                INSERT INTO users ( uuid,  id,  name,  email,  password)
                VALUES            (@uuid, @id, @name, @email, @password)
            `);
            statement.run({ uuid, id, name, email, password });
            return [null];
        } catch (e) {
            const maskedPassword = password.replaceAll(/./g, '*');
            console.error('Error in inserting into "users"', JSON.stringify({ id, name, email, password: maskedPassword }), e);
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
